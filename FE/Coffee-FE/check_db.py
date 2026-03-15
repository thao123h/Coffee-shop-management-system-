import mysql.connector

try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="coffeeshop"
    )
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM product_variants ORDER BY id DESC LIMIT 10")
    variants = cursor.fetchall()
    
    print("Found {} variants.".format(len(variants)))
    for v in variants:
        print(v)
        
    cursor.execute("SELECT * FROM products ORDER BY id DESC LIMIT 5")
    products = cursor.fetchall()
    print("\nRecent Products:")
    for p in products:
        print(p)
        
    conn.close()
except Exception as e:
    print("Error:", e)
