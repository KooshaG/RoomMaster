import requests
from bs4 import BeautifulSoup

class RoomAvailability:
  
  def __init__(self, start, end, seat_id, lid, eid, checksum):
    self.start = start
    self.end = end
    self.seat_id = seat_id
    self.lid = lid
    self.eid = eid
    self.checksum = checksum
    
  def __repr__(self):
    return f"RoomAvailability({self.start}, {self.end}, {self.seat_id}, {self.lid}, {self.eid}, {self.checksum})"
  
def getAvailabilityArray(startStr: str, LID = 2161):
  '''
  Queries the availablilty grid in libcal with the time string created in createDateStringsForRequest and returns a list of all the availablilities for that day
  '''
  url = f"https://concordiauniversity.libcal.com/r/accessible/availability?lid={LID}&date={startStr}"
  soup = BeautifulSoup(requests.get(url).text, features="html.parser")                       # use the information contained in the html, the checkboxes on the accessibility website 
  divs = soup.find_all('div', {'class': 'panel panel-default'}) # have hidden properties that we can take advantage of
  inputs = [div.find_all('input') for div in divs] # using array generator notation to compile all the input tags that contain the availability information
  inputs = [inputTag for sublist in inputs for inputTag in sublist] #flatten array
  return [RoomAvailability(
    start = input['data-start'], 
    end = input['data-end'], 
    seat_id = input['data-seat'],
    lid = LID,
    eid = int(input['data-eid']),
    checksum = input['data-crc']
    ) for input in inputs]
    