import mysql.connector as mysql
            
import re,os, hashlib

import datetime
from random import randint

from PIL import Image
import threading

class database:
    def __init__(self):
        self.db_config = {
            "host": "localhost",
            "user": "root",
            "password": "",
            "database": "riaumandiri",
            "autocommit": False,
            "connect_timeout": 5,
            "use_pure": True  # Use pure Python implementation (more stable)
        }
        # Use thread-local storage for connections
        self._local = threading.local()
    
    def _get_connection(self):
        """Get or create connection for current thread"""
        if not hasattr(self._local, 'database_rm'):
            self._local.database_rm = None
            self._local.perantara = None
        return self._local.database_rm, self._local.perantara
    
    def _set_connection(self, connection, cursor):
        """Set connection for current thread"""
        self._local.database_rm = connection
        self._local.perantara = cursor
    
    def _connect(self):
        """Establish database connection for current thread"""
        database_rm, perantara = self._get_connection()
        
        # Force close old connection if exists
        try:
            if perantara:
                perantara.close()
        except:
            pass
        
        try:
            if database_rm:
                database_rm.close()
        except:
            pass
        
        # Create fresh connection
        try:
            new_connection = mysql.connect(**self.db_config)
            new_cursor = new_connection.cursor(dictionary=True)
            self._set_connection(new_connection, new_cursor)
            print(f"[Thread {threading.current_thread().name}] Database connection established")
        except mysql.Error as err:
            print(f"Database connection error: {err}")
            self._set_connection(None, None)
    
    def _ensure_connection(self):
        """Ensure connection is alive for current thread"""
        max_retries = 3
        for attempt in range(max_retries):
            try:
                database_rm, perantara = self._get_connection()
                
                # Check if connection exists and is connected
                if database_rm is not None:
                    try:
                        if database_rm.is_connected():
                            # Try to ping
                            database_rm.ping(reconnect=False)
                            # Ensure cursor exists and is valid
                            if perantara is None:
                                new_cursor = database_rm.cursor(dictionary=True)
                                self._set_connection(database_rm, new_cursor)
                            return True
                    except:
                        # Connection or ping failed, need to reconnect
                        pass
                
                # If we get here, need fresh connection
                print(f"Reconnecting to database (attempt {attempt + 1}/{max_retries})...")
                self._connect()
                
                database_rm, perantara = self._get_connection()
                if database_rm and perantara:
                    return True
                    
            except Exception as e:
                print(f"Connection check failed (attempt {attempt + 1}/{max_retries}): {e}")
                # Force cleanup
                database_rm, perantara = self._get_connection()
                try:
                    if perantara:
                        perantara.close()
                except:
                    pass
                try:
                    if database_rm:
                        database_rm.close()
                except:
                    pass
                self._set_connection(None, None)
        
        print("Failed to establish database connection after all retries")
        return False
    
    def perbaiki_value_json(self, value):
        print(value)
        if isinstance(value, datetime.date):
            return str(value)
        if isinstance(value, datetime.timedelta):
            return str(value)
        return value
    
    def SELECT(self, namatabel, operasi="", klausa="", kondisi=""):
        # Try to ensure connection
        if not self._ensure_connection():
            print("WARNING: Database connection failed, returning empty result")
            return []
        
        # Get thread-local connection and cursor
        database_rm, perantara = self._get_connection()
        
        # Double check perantara is not None
        if perantara is None:
            print("Cursor is None after ensure_connection, returning empty result")
            return []
        
        query = f"SELECT * FROM {namatabel}"

        if operasi:
            query += f" {operasi}"

        if kondisi:
            query += f" WHERE {kondisi}"

        if klausa:
            query += f" {klausa}"

        query += ";"

        max_retries = 2
        for attempt in range(max_retries):
            try:
                # Get fresh cursor reference
                _, perantara = self._get_connection()
                if perantara is None:
                    raise Exception("Cursor is not available")
                    
                perantara.execute(query)
                rows = perantara.fetchall()
                rows = [{k: self.perbaiki_value_json(v) for k, v in row.items()} for row in rows]
                return rows
            except Exception as err:
                print(f"SELECT error (attempt {attempt + 1}/{max_retries}): {err}")
                if attempt < max_retries - 1:
                    # Try to reconnect once more
                    self._connect()
                    _, perantara = self._get_connection()
                    if perantara is None:
                        break
                else:
                    # Last attempt failed, return empty
                    print(f"Query failed after retries: {query}")
                    return []
        
        return []
    
    def INSERT(self, namatabel : str, columns : dict):
        if not self._ensure_connection():
            raise Exception("Cannot connect to database")
        
        database_rm, perantara = self._get_connection()
        
        if perantara is None:
            raise Exception("Database cursor not available")
        
        x = columns
        keys = '(' + ", ".join([a for a,b in x.items()]) + ')' if len(x) > 1 else '(' + list(x.keys())[0] + ')'
        values = tuple([str(b) for a,b in x.items()]) if len(x) > 1 else tuple(x.values())
        parameters = '(' + ', '.join(["%s"] * len(x)) + ')' if len(x) > 1 else '(%s)' 
        print(f'INSERT INTO {namatabel} {keys} values {parameters} ;', values)
        
        try:
            perantara.execute(f"INSERT INTO {namatabel} {keys} values {parameters} ;", values)
            database_rm.commit()
        except Exception as err:
            print(f"INSERT error: {err}")
            if database_rm:
                try:
                    database_rm.rollback()
                except:
                    pass
            raise
        
    def UPDATE(self, namatabel : str, columns_update : dict, kondisi : str):
        if not self._ensure_connection():
            raise Exception("Cannot connect to database")
        
        database_rm, perantara = self._get_connection()
        
        if perantara is None:
            raise Exception("Database cursor not available")
        
        columns_key_parameter = ", ".join([str(k) + "=" + "%s" for k,v in columns_update.items()])
        columns_value = tuple(str(v) for k,v in columns_update.items())
        
        try:
            perantara.execute(f"UPDATE {namatabel} SET {columns_key_parameter} WHERE {kondisi}", columns_value)
            database_rm.commit()
        except Exception as err:
            print(f"UPDATE error: {err}")
            if database_rm:
                try:
                    database_rm.rollback()
                except:
                    pass
            raise
    
    def DELETE(self, namatabel : str, kondisi : str):
        if not self._ensure_connection():
            raise Exception("Cannot connect to database")
        
        database_rm, perantara = self._get_connection()
        
        if perantara is None:
            raise Exception("Database cursor not available")
        
        try:
            perantara.execute(f"DELETE FROM {namatabel} WHERE {kondisi};")
            database_rm.commit()
        except Exception as err:
            print(f"DELETE error: {err}")
            if database_rm:
                try:
                    database_rm.rollback()
                except:
                    pass
            raise

from flask import Flask, jsonify, request,abort, send_from_directory
class server:
    def __init__(self):
        self.server = Flask(__name__)
        self.database = database()
        self.inisiasi_routes()
        
    def cek_token(self):
        token = request.headers.get("TokenSakti")
        if token != "123":
            abort(404,description="Token Jokowi")
        
    def cek_field(self, fields):
        for field in fields:
            if not request.form.get(field):
                print(f"FIeld {field} ga ada anjnek")
                
                return abort(501, f"{field} GADA ANJENK")
            else:
                print(f"FIeld {field} ada")
        
    def cek_image(self, namadarielementnya):
        print(f"REQUEST FILE = {request.files}")
        if namadarielementnya not in  request.files:
            print("FOTONYAMANA ")
            return abort(404, "FOTONYA MANA GOBLOKK")
        if request.files[namadarielementnya].filename == "":
            print("FOTONYA GAK DIMASUKKAN ")
            return abort(404, "FOTONYA KOK GAK DIMASUKKAN GOBLOKK")
        if ".png" not in request.files[namadarielementnya].filename and ".jpg" not in request.files[namadarielementnya].filename and ".jpeg" not in request.files[namadarielementnya].filename:
            print("FORMAT FOTO ")
            return abort(404, "FORMAT FOTONYA BUKAN PNG ATAU JPG GOBLOKK")
            
        
    
    def konversi_ke_id(self, namatabel, value_request, nama_original_target, nama_id_target):
        rows = self.database.SELECT(namatabel)
        for row in rows:
            if value_request in row[nama_original_target]:
                return row[nama_id_target]
            else:
                continue
        # return 0
        abort(405, "HANTU MELAYANG")
        # return abort(404, f"VALUE YANG KAMU INPUTKAN GADA DI {namatabel} SAMA SEKALI")

        
    def konversi_judul_ke_url(self, judul):
        return re.sub(r'[^a-zA-Z0-9\s]', '',judul).replace(" ", '-').lower()
       
       
    def simpan_foto_ori(self, r_image, path_gambar, simpanfotolowres=False, scale=0.185):
        nama_gambar_ori =  str(randint(100000000000,999999999999))+ '-' + r_image.filename
        path_gambar_ori = path_gambar + 'original/'+nama_gambar_ori if 'berita' in path_gambar else path_gambar + nama_gambar_ori
        r_image.save(path_gambar_ori)
        
        if simpanfotolowres:
            if 'berita' in path_gambar:
                img = Image.open(path_gambar_ori)
                img_r = img.resize((int(img.width*scale), int(img.height*scale)), Image.Resampling.LANCZOS)
                img_r.save(path_gambar + 'large/' + nama_gambar_ori)
            else:
                print('gabisa save foto lowres karna bukan berita')
        return nama_gambar_ori
        
    def hapus_foto(self, pathfotolama):
        os.remove(pathfotolama)
        
    def inisiasi_routes(self):

        @self.server.route("/dashboard", methods=["GET"])
        def dashboard():
            article_of_months = {}
            for i in range(6):
                article_of_months[f"{datetime.datetime.now().month - i}"] = len(database().SELECT('tblberita', kondisi=f"MONTH(tanggal) = {datetime.datetime.now().month - i}"))
            return jsonify([{'article_of_month' : article_of_months, 'jmlberita' : len(database().SELECT('tblberita')), 'jmlkategori' : len(database().SELECT('tblkategori')), 'jmlvideo' : len(database().SELECT('tblvideo')), 'jmluser' : len(database().SELECT('tbl_user_login'))}])  
            
        # @self.server.route("/cobaget", methods=["GET"])
        # def cobaget():
        #     return render_template("cobaget.html")

        def jeroanberita():
            fields = ['judul_berita', 
                      'isi', 
                    #   'judul_khusus', 
                      'post_status', 
                      'tanggal', 
                      'waktu', 
                      'kategori', 
                    #   'subkategori', 
                    #   'topik', 
                    #   'description', 
                    #   'tags',    
                    #   'ket_foto', 
                    #   'watermark', 
                    #   'headline', 
                    #   'pil_editor', 
                    #   'advertorial', 
                    #   'sumber', 
                    #   'reporter',
                      'penulis',
                      'created_at',
                      'updated_at',
                      'id_user_login',
                      ]
            name_image = 'upload-image'
            self.cek_field(fields)
            self.cek_image(name_image)

            # r_judulkhusus = request.form.get('judulkhusus');r_watermark = request.form.get('watermark')
            # LEAD ????? KODE REDAKTUR ????

            r_title = request.form.get('judul_berita')
            r_content = request.form.get('isi')
            r_judulkhusus = request.form.get('judul_khusus')
            r_status = request.form.get('post_status')
            r_tanggal = request.form.get('tanggal')
            r_waktu = request.form.get('waktu')
            r_kategori = request.form.get('kategori')
            r_subkategori =  request.form.get('subkategori')
            r_topic = request.form.get('topik')
            r_description = request.form.get('description')
            r_tags = request.form.get('tags')
            r_upload_image = request.files[name_image]
            r_caption = request.form.get('ket_foto') 
            r_watermark = request.form.get('watermark')
            r_headline = request.form.get('headline')
            r_pilihaneditor = request.form.get('pil_editor')
            r_advertorial = request.form.get('advertorial')
            r_sumber = request.form.get('sumber')
            r_reporter = request.form.get('reporter')
            r_editor = request.form.get('penulis')
            r_createdat = request.form.get('created_at')
            r_updatedat = request.form.get('updated_at')
            r_iduserlogin = request.form.get('id_user_login')
            
            r_kategori = self.konversi_ke_id(namatabel='tblkategori', value_request=r_kategori, nama_original_target='nama_kategori', nama_id_target='id_kategori')
            r_subkategori = self.konversi_ke_id(namatabel='tblsub', value_request=r_subkategori, nama_original_target='sub', nama_id_target='id_sub')
            r_topic = self.konversi_ke_id(namatabel='tbltopik', value_request=r_topic, nama_original_target='topik', nama_id_target='id_topik')
                
            
            title_url = self.konversi_judul_ke_url(r_title)
            
            nama_gambar_baru = self.simpan_foto_ori(r_upload_image, 'assets/berita/' , simpanfotolowres=True)
            
            
            data = {'id_kategori' : r_kategori, 
                    'judul_berita' : r_title, 
                    'judul_khusus' : r_judulkhusus, 
                    'description' : r_description, 
                    'isi' : r_content, 
                    'gambar' : nama_gambar_baru, 
                    'tanggal' : r_tanggal, 
                    'waktu' : r_waktu, 
                    'post_status' : r_status, 
                    'counter' : '0', 
                    'url' : title_url, 
                    'ket_foto' : r_caption, 
                    'watermark' : r_watermark, 
                    'tags' : r_tags, 
                    'headline' : r_headline, 
                    'foto_kecil' : nama_gambar_baru, 
                    'id_sub' : r_subkategori, 
                    'pil_editor' : r_pilihaneditor, 
                    'advertorial' : r_advertorial, 
                    'id_user_login' : r_iduserlogin, 
                    'reporter' : r_reporter, 
                    'penulis' : r_editor, 
                    'publish' : 'Y' if r_status == 'published' else 'N', 
                    'warta' : r_reporter, 
                    'sumber' : r_sumber, 
                    'id_topik' : r_topic, 
                    'created_at' : r_createdat, 
                    'updated_at' : r_updatedat, 
                    }
              
            return data
             

        @self.server.route('/berita', methods=['GET','POST'])
        def berita():
            namatabel = "tblberita"
            if request.method == "GET":
                namatabel = "tblberita"
                limit = request.args.get("limit", 10, type=int)
                halaman = request.args.get("halaman", 1, type=int)
                offset = (halaman - 1) * limit
                
                # Special filters (bukan kategori)
                terpopuler = request.args.get("terpopuler", 0, type=int)
                headline = request.args.get("headline", 0, type=int)
                pilihaneditor = request.args.get("pilihaneditor", 0, type=int)
                advertorial = request.args.get("advertorial", 0, type=int)
                watermark = request.args.get("watermark", 0, type=int)
                
                # Kategori (optional - bisa kosong untuk special filters)
                kategori = request.args.get("kategori", "", type=str)
                
                publish = request.args.get("publish", "Y", type=str)
                
                # Date filtering parameters
                start_date = request.args.get("start_date", None, type=str)
                end_date = request.args.get("end_date", None, type=str)
                
                # Debug log
                print(f"[DEBUG] Berita - Start: {start_date}, End: {end_date}")

                search = request.args.get("search", "", type=str)

                # Build kondisi
                kondisi_parts = []
                
                # Add kategori filter only if provided
                if kategori:
                    kondisi_parts.append(f"tblkategori.permalink = '{kategori}'")

                # Add search filter if provided
                if search:
                    keywords = search.strip().split()
                    for kw in keywords:
                        kw = kw.replace("'", "''")
                        kondisi_parts.append(f"tblberita.judul_berita LIKE '%{kw}%'")
                
                # Special filters
                if terpopuler == 1:
                    pass  # Handled by ORDER BY
                if headline == 1:
                    kondisi_parts.append(f"tblberita.headline = 1")
                if pilihaneditor == 1:
                    kondisi_parts.append(f"tblberita.pil_editor = 1")
                if advertorial == 1:
                    kondisi_parts.append(f"tblberita.advertorial = 1")
                if watermark == 1:
                    kondisi_parts.append(f"tblberita.watermark = 1")

                # Filter publish
                if publish.upper() == 'Y':
                    kondisi_parts.append(f"tblberita.publish = 'Y'")
                
                # Add date filters if provided
                if start_date:
                    kondisi_parts.append(f"tblberita.tanggal >= '{start_date}'")
                if end_date:
                    kondisi_parts.append(f"tblberita.tanggal <= '{end_date}'")
                
                # Join conditions with AND
                kondisi = " AND ".join(kondisi_parts) if kondisi_parts else ""
                
                # Debug log the query
                print(f"[DEBUG] Query kondisi: {kondisi}")
                
                # Get paginated articles directly (no need to fetch all for counting)
                order_by = "ORDER BY tblberita.counter DESC" if terpopuler == 1 else "ORDER BY tblberita.tanggal DESC, tblberita.waktu DESC"
                articles = self.database.SELECT(
                    namatabel=namatabel,
                    operasi="JOIN tblkategori ON tblberita.id_kategori = tblkategori.id_kategori",
                    kondisi=kondisi,
                    klausa=f"{order_by} LIMIT {limit} OFFSET {offset}"
                )
                
                print(f"[DEBUG] Found {len(articles)} articles")
                
                # Use SQL COUNT for total (much faster)
                total = 0
                try:
                    # Use raw SQL for COUNT
                    self.database._ensure_connection()
                    _, perantara = self.database._get_connection()
                    if perantara:
                        count_query = f"SELECT COUNT(*) as total FROM {namatabel} JOIN tblkategori ON tblberita.id_kategori = tblkategori.id_kategori"
                        if kondisi:
                            count_query += f" WHERE {kondisi}"
                        print(f"[COUNT] Query: {count_query}")
                        perantara.execute(count_query)
                        count_result = perantara.fetchone()
                        total = count_result['total'] if count_result else 0
                        print(f"[COUNT] Total: {total}")
                except Exception as e:
                    print(f"[ERROR] COUNT query error: {e}")
                    import traceback
                    traceback.print_exc()
                    total = len(articles)  # Fallback to article count
                
                return jsonify({
                    "data": articles,
                    "pagination": {
                        "currentPage": halaman,
                        "totalPages": (total + limit - 1) // limit if total > 0 else 0,
                        "totalItems": total,
                        "itemsPerPage": limit
                    }
                })
            else:
                data = jeroanberita()
                print(data)
                self.database.INSERT(namatabel, data)
                return jsonify(data)
        
        
        @self.server.route('/berita/<id_berita>', methods=["GET", "PUT", "DELETE"])
        def beritaupdatedelete(id_berita):
            namatabel = "tblberita"
            if request.method == "GET": 
                result = self.database.SELECT(
                    namatabel=namatabel,
                    operasi="JOIN tblkategori ON tblberita.id_kategori = tblkategori.id_kategori",
                    kondisi=f"id_berita = '{id_berita}'"
                )
                return jsonify(result)
            nama_foto_lama = self.database.SELECT(namatabel, kondisi=f"id_berita = '{id_berita}'")[0]['gambar']
            self.hapus_foto('assets/berita/original/' + nama_foto_lama)
            self.hapus_foto('assets/berita/large/' + nama_foto_lama)
            if request.method == "PUT":
                data = jeroanberita()
                self.database.UPDATE(namatabel, kondisi=f"id_berita = {id_berita}", columns_update=data)
                return jsonify(data)
            else:
                self.database.DELETE(namatabel, kondisi=f"id_berita = {id_berita}")
                return f"Berita dengan ID {id_berita} TERHAPUS!"
         

        
        
        @self.server.route('/search/<judul_berita>', methods=['GET'])
        def searchjudulberita(judul_berita):
            namatabel = "tblberita"
            if request.method == "GET":
                list_keyword = judul_berita.split('-')
                results = []
                for keyword in list_keyword:
                    x = self.database.SELECT(namatabel,operasi="JOIN tblkategori ON tblberita.id_kategori = tblkategori.id_kategori" , kondisi=f"judul_berita LIKE '%{keyword}%'", klausa="ORDER BY tblberita.tanggal DESC")
                    if x:
                        results.extend(x)
                # Remove duplicates
                unique_results = {item['id_berita']: item for item in results}.values()
                return jsonify(list(unique_results))
            else:
                return "Method not allowed"
        
        # Copilot 
        @self.server.route('/kategori/<kategori>', methods=['GET'])
        def beritabykategori(kategori):
            namatabel = "tblberita"
            limit = request.args.get("limit", 10, type=int)
            halaman = request.args.get("halaman", 1, type=int)
            offset = (halaman - 1) * limit
            
            # Date filtering parameters
            start_date = request.args.get("start_date", None, type=str)
            end_date = request.args.get("end_date", None, type=str)
            
            # Build WHERE condition
            kondisi_parts = [f"tblkategori.permalink = '{kategori}'"]
            
            # Add date filters if provided
            if start_date:
                kondisi_parts.append(f"tblberita.tanggal >= '{start_date}'")
            if end_date:
                kondisi_parts.append(f"tblberita.tanggal <= '{end_date}'")
            
            kondisi = " AND ".join(kondisi_parts)
            
            # Get paginated articles with date filter
            articles = self.database.SELECT(
                namatabel=namatabel,
                operasi="JOIN tblkategori ON tblberita.id_kategori = tblkategori.id_kategori",
                kondisi=kondisi,
                klausa=f"ORDER BY tblberita.tanggal DESC, tblberita.waktu DESC LIMIT {limit} OFFSET {offset}"
            )
            
            # Use SQL COUNT for total (much faster)
            total = 0
            try:
                self.database._ensure_connection()  # Ensure connection before COUNT
                _, perantara = self.database._get_connection()
                if perantara:
                    count_query = f"SELECT COUNT(*) as total FROM {namatabel} JOIN tblkategori ON tblberita.id_kategori = tblkategori.id_kategori WHERE {kondisi}"
                    print(f"[COUNT] Query: {count_query}")
                    perantara.execute(count_query)
                    count_result = perantara.fetchone()
                    total = count_result['total'] if count_result else 0
                    print(f"[COUNT] Total: {total}")
            except Exception as e:
                print(f"[ERROR] COUNT query error: {e}")
                import traceback
                traceback.print_exc()
                total = len(articles)  # Fallback to article count
            
            return jsonify({
                "data": articles,
                "pagination": {
                    "currentPage": halaman,
                    "totalPages": (total + limit - 1) // limit if total > 0 else 0,
                    "totalItems": total,
                    "itemsPerPage": limit
                }
            })
        
        @self.server.route('/<id_or_url>', methods=["GET"])
        def artikelbyidorurl(id_or_url):
            namatabel = "tblberita"
            
            # Try by ID first
            if id_or_url.isdigit():
                result = self.database.SELECT(
                    namatabel=namatabel,
                    operasi="JOIN tblkategori ON tblberita.id_kategori = tblkategori.id_kategori",
                    kondisi=f"id_berita = '{id_or_url}'"
                )
            else:
                # Try by URL
                result = self.database.SELECT(
                    namatabel=namatabel,
                    operasi="JOIN tblkategori ON tblberita.id_kategori = tblkategori.id_kategori",
                    kondisi=f"url = '{id_or_url}'"
                )
            
            if result:
                # Increment counter
                id_berita = result[0]['id_berita']
                counterlama = result[0]['counter']
                counterbaru = counterlama + 1
                self.database.UPDATE(namatabel, kondisi=f"id_berita = {id_berita}", columns_update={'counter': counterbaru})
                return jsonify(result[0])
            else:
                abort(404, description="Article not found")
        
        @self.server.route('/artikel/<id_berita>/related', methods=['GET'])
        def artikelrelated(id_berita):
            namatabel = "tblberita"
            limit = request.args.get("limit", 2, type=int)
            
            # Get current article's category
            current = self.database.SELECT(namatabel, kondisi=f"id_berita = '{id_berita}'")
            if not current:
                return jsonify([])
            
            id_kategori = current[0]['id_kategori']
            
            # Get related articles from same category, excluding current
            related = self.database.SELECT(
                namatabel=namatabel,
                kondisi=f"id_kategori = {id_kategori} AND id_berita != {id_berita}",
                klausa=f"ORDER BY tanggal DESC LIMIT {limit}"
            )
            
            return jsonify(related)
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        def jeroankategori(TIPE=""):
            fields = ['nama_kategori', 'pin' ,'created_at', 'updated_at']
            self.cek_field(fields)
            r_namakategori = request.form.get("nama_kategori")
            r_pin = request.form.get("pin")
            r_createdat = request.form.get("created_at")
            r_updatedat = request.form.get("updated_at")
            if TIPE == "POST":
                link_kategori = r_namakategori.lower().replace(" ","-")
            else:
                link_kategori = request.form.get("kategoriurl")
            data = {'nama_kategori' : r_namakategori, 'pin': r_pin, 'permalink': link_kategori, 'created_at' : r_createdat, 'updated_at' : r_updatedat}
            return data
            
        @self.server.route("/kategori", methods=["GET", "POST"])
        def kategori():
            namatabel = "tblkategori"
            if request.method == "GET":
                return jsonify(self.database.SELECT(namatabel=namatabel))
            else:
                data = jeroankategori(TIPE="POST")
                self.database.INSERT(namatabel, data)
                return jsonify(data)
            
        @self.server.route("/kategori/<id_kategori>", methods=["GET", "PUT", "DELETE"])
        def kategoriupdatedelete(id_kategori):
            namatabel = "tblkategori"
            if request.method == "GET": 
                return jsonify(self.database.SELECT(namatabel=namatabel, kondisi=f"id_kategori = '{id_kategori}'"))
            if request.method == 'PUT':
                namatabel = "tblkategori"
                data = jeroankategori(TIPE="PUT")
                self.database.UPDATE(namatabel, columns_update=data, kondisi=f"id_kategori = '{id_kategori}'")
                return jsonify(data)
            else:
                self.database.DELETE(namatabel, f"id_kategori = '{id_kategori}'")
                return f"Kategori dengan id {id_kategori} telah dihapus!"
                
                
        def jeroansubkategori(TIPE=""):
            fields = ['kategori', 'sub','created_at', 'updated_at']
            self.cek_field(fields)
            r_kategori = request.form.get("kategori")       
            r_subkategori = request.form.get("sub")  
            r_createdat = request.form.get("created_at")
            r_updatedat = request.form.get("updated_at")              
            if TIPE == "POST":
                link_subkategori = r_subkategori.lower().replace(" ","-")     
            else:
                link_subkategori = request.form.get("subkategoriurl")
            kategori_id = database().SELECT('tblkategori', kondisi=f"nama_kategori = '{r_kategori}'")[0]['id_kategori']
            data = {'id_kategori' : kategori_id, 'sub' : r_subkategori, 'permalinksub' : link_subkategori, 'created_at': r_createdat, 'updated_at' : r_updatedat}    
            return data
                
        @self.server.route("/subkategori", methods=["GET", "POST"])
        def subkategori():
            namatabel = "tblsub"
            if request.method == "GET":
                # self.database.SELECT('tblsub', operasi="JOIN tblkategori ON tblsub.id_kategori = tblkategori.id_kategori")
                return jsonify(self.database.SELECT(namatabel=namatabel))
            else:
                data = jeroansubkategori(TIPE="POST")
                self.database.INSERT(namatabel, data)
                return jsonify(data)

        @self.server.route("/subkategori/<id_sub>", methods=["GET", "PUT", "DELETE"])
        def subkategoriupdatedelete(id_sub):
            namatabel = "tblsub"
            if request.method == "GET": 
                return jsonify(self.database.SELECT(namatabel=namatabel, kondisi=f"id_sub = '{id_sub}'"))
            if request.method == "PUT":
                data = jeroansubkategori(TIPE="PUT")
                self.database.UPDATE(namatabel, columns_update=data, kondisi=f"id_sub = '{id_sub}'")
                return jsonify(data)
            else:
                self.database.DELETE(namatabel, f"id_sub = '{id_sub}'")
                return f"Subkategori dengan id {id_sub} telah dihapus!"
        
        
        
        
        def jeroanpages(TIPE=""):
            fields = ['title', 'content', 'created_at', 'updated_at']
            self.cek_field(fields)
            r_title = request.form.get("title")
            r_content = request.form.get("content")
            r_createdat = request.form.get("created_at")
            r_updatedat = request.form.get("updated_at")
            if TIPE == "POST":
                link_title = r_title.lower().replace(" ","-")
            else:
                link_title = request.form.get("titleurl")
            data = {'title' : r_title, 'url': link_title, 'content' : r_content, 'created_at' : r_createdat, 'updated_at' : r_updatedat}
            return data
            
        @self.server.route("/pages", methods=["GET", "POST"])
        def pages():
            namatabel = "tblpages"
            if request.method == "GET":
                return jsonify(self.database.SELECT(namatabel=namatabel))
            else:
                data = jeroanpages(TIPE="POST")
                self.database.INSERT(namatabel, data)
                return jsonify(data)
            
        @self.server.route("/pages/<id_pages>", methods=["GET", "PUT", "DELETE"])
        def pagesupdatedelete(id_pages):
            namatabel = "tblpages"
            if request.method == "GET": 
                return jsonify(self.database.SELECT(namatabel=namatabel, kondisi=f"id_pages = '{id_pages}'"))
            if request.method == 'PUT':
                data = jeroanpages(TIPE="PUT")
                self.database.UPDATE(namatabel, columns_update=data, kondisi=f"id_pages = '{id_pages}'")
                return jsonify(data)
            else:
                self.database.DELETE(namatabel, f"id_pages = '{id_pages}'")
                return f"Pages dengan id {id_pages} telah dihapus!"
        
        
        
        def jeroantopik():
            fields = ['topik', 'created_at', 'updated_at']
            self.cek_field(fields)
            r_topik = request.form.get('topik')
            r_createdat = request.form.get('created_at')
            r_updatedat = request.form.get('updated_at')
            data = {'topik' : r_topik, 'created_at' : r_createdat, 'updated_at' : r_updatedat}
            return data
        
        @self.server.route("/topik", methods=["GET", "POST"])
        def topik():
            namatabel = "tbltopik"
            if request.method == "GET":
                return jsonify(self.database.SELECT(namatabel=namatabel))
            else:
                data = jeroantopik()
                self.database.INSERT(namatabel, data)
                return jsonify(data)
            
        @self.server.route("/topik/<id_topik>", methods=["GET", "PUT", "DELETE"])
        def topikupdatedelete(id_topik):
            namatabel = "tbltopik"
            if request.method == "GET": 
                return jsonify(self.database.SELECT(namatabel=namatabel, kondisi=f"id_topik = '{id_topik}'"))
            if request.method == "PUT":
                data = jeroantopik()
                self.database.UPDATE(namatabel, columns_update=data, kondisi=f"id_topik = '{id_topik}'")
                return jsonify(data)
            else:
                self.database.DELETE(namatabel, f"id_topik = '{id_topik}'")
                return f"Topik dengan id {id_topik} telah dihapus!"
        
        
        
        
        
        
        
        
        
        
        
        def jeroanalbumgaleri():
            fields = ['nama_album', 'keterangan', 'tanggal_album', 'waktu', 'sub', 'created_at', 'updated_at']
            name_image = 'upload-image'
            self.cek_field(fields)
            self.cek_image(name_image)

            r_title = request.form.get('nama_album')
            r_content = request.form.get('keterangan')
            r_tanggal = request.form.get('tanggal_album')
            r_waktu = request.form.get('waktu')
            r_subkategori =  request.form.get('sub')
            r_createdat =  request.form.get('created_at')
            r_updatedat =  request.form.get('updated_at')
            r_upload_image = request.files[name_image]
            
            r_subkategori = self.konversi_ke_id(namatabel='tblsub', value_request=r_subkategori, nama_original_target='sub', nama_id_target='id_sub')
            
            title_url = self.konversi_judul_ke_url(r_title)
            
            nama_gambar_baru = self.simpan_foto_ori(r_upload_image, 'assets/galeri/' )
            
            
            data = {'nama_album' : r_title, 
                    'gambar' : nama_gambar_baru, 
                    'counter' : '0', 
                    'tanggal_album' : r_tanggal, 
                    'waktu' : r_waktu, 
                    'keterangan' : r_content, 
                    'id_sub' : r_subkategori, 
                    'permalink' : title_url,
                    'created_at' : r_createdat,
                    'updated_at' : r_updatedat}
              
            return data
        
        
        @self.server.route("/albumgaleri", methods=["GET", "POST"])
        def albumgaleri():
            namatabel = "tbl_album_galeri"
            if request.method == "GET":
                return jsonify(self.database.SELECT(namatabel=namatabel, klausa="ORDER BY id_album DESC"))
            else:
                data = jeroanalbumgaleri()
                self.database.INSERT(namatabel, data)
                return jsonify(data)
        
        
        
        @self.server.route('/albumgaleri/<id_album>', methods=["GET", "PUT", "DELETE"])
        def albumgaleriupdatedelete(id_album):
            namatabel = "tbl_album_galeri"
            if request.method == "GET":
                data = self.database.SELECT(namatabel, kondisi=f"id_album = '{id_album}'")
                return jsonify(data)
            nama_foto_lama = self.database.SELECT(namatabel, kondisi=f"id_album = '{id_album}'")[0]['gambar']
            self.hapus_foto('assets/galeri/original/' + nama_foto_lama)
            if request.method == "PUT":
                data = jeroanalbumgaleri()
                self.database.UPDATE(namatabel, kondisi=f"id_album = {id_album}", columns_update=data)
                return jsonify(data)
            else:
                self.database.DELETE(namatabel, kondisi=f"id_album = {id_album}")
                return f"Album dengan ID {id_album} TERHAPUS!"
        
        
        
        
        
        
    
        
        
        @self.server.route("/album", methods=["GET"])
        def album():
            namatabel = "tbl_album_galeri"
            if request.method == "GET":
                return jsonify(self.database.SELECT(namatabel=namatabel))
            
        
        def jeroanvideo():
            fields = ['url', 'created_at','updated_at']
            self.cek_field(fields)

            r_url = request.form.get('url')
            r_createdat = request.form.get('created_at')
            r_updatedat = request.form.get('updated_at')
            
            data = {'url' : r_url, 'created_at' : r_createdat, 'updated_at' : r_updatedat}
            return data
        
        @self.server.route("/video", methods=["GET", "POST"])
        def video():
            namatabel = "tblvideo"
            if request.method == "GET":
                return jsonify(self.database.SELECT(namatabel=namatabel))
            else:
                data = jeroanvideo()
                self.database.INSERT(namatabel, data)
                return jsonify(data)
        
        
        
        @self.server.route('/video/<id_video>', methods=["GET","PUT", "DELETE"])
        def videoupdatedelete(id_video):
            namatabel = "tblvideo"
            if request.method == "GET":
                data = self.database.SELECT(namatabel, kondisi=f"id_video = '{id_video}'")
                return jsonify(data)
            if request.method == "PUT":
                data = jeroanvideo()
                self.database.UPDATE(namatabel, kondisi=f"id_video = {id_video}", columns_update=data)
                return jsonify(data)
            else:
                self.database.DELETE(namatabel, kondisi=f"id_video = {id_video}")
                return f"Video dengan ID {id_video} TERHAPUS!"
        
        
        
        
        
        
        
        # @self.server.route("/posbanner", methods=['GET'])
        # def posbanner():
        #     return jsonify(self.database.SELECT('tblposbanner'))
         
        def jeroanbanner():
            fields = ["judul", "keterangan", 'tanggal', "waktu", "status", "status2" ,"posbanner", "created_at", "updated_at"]
            name_image = "fotobanner"
            self.cek_field(fields)
            self.cek_image(name_image)

            r_judul = request.form.get("judul"); r_keterangan = request.form.get("keterangan"); r_tanggal = request.form.get("tanggal"); r_waktu = request.form.get("waktu"); r_status = request.form.get("status"); r_jenisiklan = request.form.get("status2"); r_posisi = request.form.get("posbanner"); r_fotobanner = request.files[name_image]; r_createdat = request.form.get("created_at"); r_updatedat = request.form.get("updated_at")

            r_posisi = self.konversi_ke_id(namatabel="tblposbanner", value_request= r_posisi, nama_original_target='posbanner', nama_id_target='id_posbanner')
                
            nama_gambar_baru = self.simpan_foto_ori(r_fotobanner, 'assets/banner/')
                
            # data = {'judul' : r_judul,  'keterangan' : r_keterangan, 'foto_kecil' : nama_gambar_baru, 'foto_besar' : nama_gambar_baru, 'tanggal' : r_tanggal, 'waktu' : r_waktu, 'status' : 'Y' if r_status == "Aktif" else "G", 'id_sub' : r_posisi, 'status2' : 'G' if r_jenisiklan == "Gambar" else 'Y'}
            data = {'judul' : r_judul,  'keterangan' : r_keterangan,  'foto_besar' : nama_gambar_baru, 'tanggal' : r_tanggal, 'waktu' : r_waktu, 'status' : 'Y' if r_status == "Aktif" else "N", 'id_posbanner' : r_posisi, 'status2' : 'G' if r_jenisiklan == "Gambar" else 'Y', 'created_at' : r_createdat, 'updated_at' : r_updatedat}
            return data
         
        @self.server.route("/banner", methods=["GET", "POST"])
        def banner():
            namatabel = "tbl_banner"
            if request.method == 'GET':
                #     return jsonify(self.database.SELECT(namatabel="tblberita", operasi="JOIN tblkategori ON tblberita.id_kategori = tblkategori.id_kategori",  kondisi=f"permalink = '{kategori}'", klausa="LIMIT 5"))
                return jsonify(self.database.SELECT(namatabel=namatabel, operasi=f"JOIN tblposbanner ON {namatabel}.id_posbanner = tblposbanner.id_posbanner", klausa="ORDER BY id_banner DESC", kondisi="status = 'Y'"))
            else:
                data = jeroanbanner()
                self.database.INSERT(namatabel, data)
                return jsonify(data)
            
        
        @self.server.route("/banner/<id_banner>", methods=["PUT", "GET", "DELETE"])
        def bannerupdatedelete(id_banner):
            namatabel = "tbl_banner"
            if request.method == "GET": 
                return jsonify(self.database.SELECT(namatabel=namatabel, kondisi=f"id_banner = '{id_banner}'"))
            nama_foto_lama = self.database.SELECT(namatabel, kondisi=f"id_banner = '{id_banner}'")[0]['foto_besar']
            self.hapus_foto('assets/banner/original/' + nama_foto_lama)
            if request.method == "PUT":
                data = jeroanbanner()
                self.database.UPDATE(namatabel, columns_update=data, kondisi=f"id_banner = '{id_banner}'")
                return jsonify(data)
            else:
                self.database.DELETE(namatabel, f"id_banner = '{id_banner}'")
                return f"Banner dengan id {id_banner} telah dihapus!"
    

        def jeroanusers():
            fields = ['username', 'password', 'nama_pengguna', 'status', 'created_at', 'updated_at']
            self.cek_field(fields)
            r_username = request.form.get('username');r_password = request.form.get('password');r_namapengguna = request.form.get('nama_pengguna');r_status = request.form.get('status');r_createdat = request.form.get('created_at');r_updatedat = request.form.get('updated_at')
            
            r_password = hashlib.md5(r_password.encode()).hexdigest()
            
            data = {'username' : r_username, 'password' : r_password, 'nama_pengguna' : r_namapengguna, 'status' : r_status, 'created_at' : r_createdat, 'updated_at' : r_updatedat}
            return data
        
        @self.server.route("/users", methods=["GET", "POST"])
        def users():
            namatabel = 'tbl_user_login'
            if request.method == "GET":
                return jsonify(self.database.SELECT(namatabel=namatabel))
            else:
                data = jeroanusers()
                self.database.INSERT(namatabel, data)
                return jsonify(data)
            
        @self.server.route("/users/<id_user_login>", methods=["GET","PUT", "DELETE"])
        def usersupdatedelete(id_user_login):
            namatabel = 'tbl_user_login'
            if request.method == "GET":
                data = self.database.SELECT(namatabel, kondisi=f"id_user_login = '{id_user_login}'")
                return jsonify(data)
            if request.method == "PUT":
                data = jeroanusers()
                self.database.UPDATE(namatabel, columns_update=data, kondisi=f"id_user_login = '{id_user_login}'")
                return jsonify(data)
            else:
                self.database.DELETE(namatabel, f"id_user_login = '{id_user_login}'")
                return f"Users dengan id {id_user_login} telah dihapus!"
     
     
     
     
        def jeroanlog():
            fields = ['id_user_login', 'isi', 'created_at', 'updated_at']
            self.cek_field(fields)
            r_iduserlogin = request.form.get('iduserlogin')
            r_isi = request.form.get('isi')
            r_createdat = request.form.get('created_at')
            r_updatedat = request.form.get('updated_at')
            data = {'id_user_login' : r_iduserlogin, 'isi' : r_isi, 'created_at' : r_createdat, 'updated_at' : r_updatedat}
            return data
     
     
        @self.server.route("/log", methods=["GET", "POST"])
        def log():
            namatabel = "tbl_log"
            if request.method == "GET":
                return jsonify(self.database.SELECT(namatabel=namatabel))
            else:
                data = jeroanlog()
                self.database.INSERT(namatabel, data)
                return jsonify(data)
            
        @self.server.route("/log/<id_log>", methods=["GET", "PUT", "DELETE"])
        def logupdatedelete(id_log):
            namatabel = "tbl_log"
            if request.method == "GET": 
                return jsonify(self.database.SELECT(namatabel=namatabel, kondisi=f"log_id = '{id_log}'"))
            if request.method == "PUT":
                data = jeroanlog()
                self.database.UPDATE(namatabel, columns_update=data, kondisi=f"log_id = '{id_log}'")
                return jsonify(data)
            else:
                self.database.DELETE(namatabel, f"log_id = '{id_log}'")
                return f"Log dengan id {id_log} telah dihapus!"
     
     
     
         
         
         
        def counter(namatabel, namaidditabel, aidi):
            counterlama = database().SELECT(namatabel, kondisi=f"{namaidditabel} = {aidi}")[0]['counter']
            counterbaru = counterlama + 1
            self.database.UPDATE(namatabel, kondisi=f"{namaidditabel} = {aidi}", columns_update={'counter' : counterbaru})
            return f"{counterlama} -> {counterbaru}"
            
        @self.server.route('/berita/addcounter/<idberita>')
        def penambahcounterberita(idberita):
            return counter("tblberita", "id_berita", idberita)
        
        @self.server.route('/album/addcounter/<idalbum>')
        def penambahcounteralbum(idalbum):
            return counter("tbl_album_galeri", "id_album", idalbum)
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        @self.server.route("/foto/banner/<nama_file>", methods=["GET"])
        def foto_banner(nama_file):
            return send_from_directory('assets/banner', nama_file)
        
        @self.server.route("/foto/berita/large/<nama_file>", methods=["GET"])
        def foto_berita_large(nama_file):
            return send_from_directory('assets/berita/large', nama_file)
        
        @self.server.route("/foto/berita/original/<nama_file>", methods=["GET"])
        def foto_berita_original(nama_file):
            return send_from_directory('assets/berita/original', nama_file)
        
        @self.server.route("/foto/galeri/<nama_file>", methods=["GET"])
        def foto_galeri(nama_file):
            return send_from_directory('assets/galeri', nama_file)
        
        # @self.server.route("/foto/video/large/<nama_file>", methods=["GET"])
        # def foto_video_large(nama_file):
        #     return send_from_directory('assets/video/large', nama_file)
        
        # @self.server.route("/foto/video/original/<nama_file>", methods=["GET"])
        # def foto_video_original(nama_file):
        #     return send_from_directory('assets/video/original', nama_file)
        

        
        
        
    
    def run(self):
        self.server.run(debug=True, port=81, host="0.0.0.0")

server().run()