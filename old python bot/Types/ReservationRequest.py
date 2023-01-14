class ReservationRequest:
  
  def __init__(self, dow, iso_weekday, startTime, endTime, slots30mins):
    self.dow = dow
    self.iso_weekday = iso_weekday
    self.startTime = startTime
    self.endTime = endTime
    self.slots30mins = slots30mins
    
  def __repr__(self):
    return f"ReservationRequest(dow='{self.dow}', iso_weekday={self.iso_weekday}, startTime='{self.startTime}', endTime='{self.endTime}', slots30mins={self.slots30mins})"
    
KOOSHA_RESERVATION_TIMES = [
  ReservationRequest('Monday', 1, '10:30:00', '13:30:00', 6),
  ReservationRequest('Wednesday', 3, '12:30:00', '15:00:00', 5)
]