import psycopg2
import os

DB_HOSTNAME = os.environ['DB_HOSTNAME']
DB_DATABASE = os.environ['DB_DATABASE']
DB_USER = os.environ['DB_USER']
DB_PASSWORD = os.environ['DB_PASSWORD']

def createDBConnection():
  conn = psycopg2.connect(
    host=DB_HOSTNAME,
    database=DB_DATABASE,
    user=DB_USER,
    password=DB_PASSWORD
  )
  return conn
  
def destroyDBConnection(conn):
  conn.close()
  
def addDay(days_from_epoch: int, conn):
  cursor = conn.cursor()
  try:
    cursor.execute(f"INSERT INTO days(days_from_epoch) VALUES({days_from_epoch})")
    conn.commit()
  except:
    print("SQL insertion failed!!!")
    cursor.close()
    return False
    
  cursor.close()
  return True

def findDay(days_from_epoch: int, conn) -> int:
  cursor = conn.cursor()
  sql = f"SELECT days_from_epoch FROM days WHERE days_from_epoch = {days_from_epoch}"
  try:
    cursor.execute(sql)
  except:
    print("SQL selection failed!!!")
    cursor.close()
    return 0
  
  res = cursor.fetchone()
  cursor.close()
  return 0 if res == None else res[0]

def deleteDay(days_from_epoch: int, conn) -> int:
  cursor = conn.cursor()
  try:
    cursor.execute(f"DELETE FROM days WHERE days_from_epoch = {days_from_epoch} RETURNING days_from_epoch")
    conn.commit()
  except:
    print("SQL deletion failed!!!")
    cursor.close()
    return 0
  
  res = cursor.fetchone()
  return 0 if res == None else res[0]

def main():
  print(f"{DB_HOSTNAME},{DB_DATABASE},{DB_USER},{DB_PASSWORD}")
  
  conn = createDBConnection()
  
  print(addDay(3, conn))
  print(addDay(4, conn))
  print(addDay(5, conn))
  print(addDay(22, conn))
  
  print(findDay(3, conn))
  print(findDay(2, conn))
  
  print(deleteDay(3,conn))
  print(deleteDay(2,conn))
  
  print(findDay(3, conn))
  print(findDay(2, conn))
  
  destroyDBConnection(conn)
if __name__ == "__main__":
  main()