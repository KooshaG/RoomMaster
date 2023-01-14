class Room:
  
  def __init__(self, name: str, eid: int, tech: bool, priority: int):
    self.name = name
    self.eid = eid
    self.tech = tech
    self.priority = priority
    
  def __str__(self) -> str:
    return f"Room: {self.name}, eid: {self.eid}, Tech: {self.tech}, Priority: {self.priority}"
  
  def __repr__(self) -> str:
    return f"Room('{self.name}', {self.eid}, {self.tech}, {self.priority})"
    
LIB_FLOOR_2 = [
  Room('LB 257 - Croatia', 18520, True, 1),
  Room('LB 251 - Luxembourg', 18518, False, 2),
  Room('LB 259 - New Zealand', 18522, False, 2),
]

LIB_FLOOR_3 = [
  Room('LB 351 - Netherlands', 18508, True, 3),
  Room('LB 353 - Kenya', 18535, True, 3),
  Room('LB 359 - Vietnam', 18536, True, 3),
]

LIB_FLOOR_4 = [
  Room('LB 451 - Brazil', 18510, True, 4),
  Room('LB 453 - Japan', 18512, True, 4),
  Room('LB 459 - Italy', 18523, True, 4),
]

LIB_FLOOR_5 = [
  Room('LB 518 - Ukraine', 18524, True, 5),
  Room('LB 520 - South Africa', 18525, True, 5),
  Room('LB 522 - Peru', 18526, True, 5),
  Room('LB 547 - Lithuania', 18511, True, 5),
  Room('LB 583 - Poland', 18528, True, 5),
]

LIB_ALL = LIB_FLOOR_2 + LIB_FLOOR_3 + LIB_FLOOR_4 + LIB_FLOOR_5

ROOMS = [ # first index is highest priority, as it goes down the list, the less favorable the spot is
  [
    {
      'eid': 18520,
      'tech': True,
      'name': 'LB 257 - Croatia',
      'priority': 1
    },
  ],
  [
    {
      'eid': 18518,
      'tech': False,
      'name': 'LB 251 - Luxembourg',
      'priority': 2
    },
    {
      'eid': 18522,
      'tech': False,
      'name': 'LB 259 - New Zealand',
      'priority': 2
    },
  ],
  [
    {
      'eid': 18508,
      'tech': True,
      'name': 'LB 351 - Netherlands',
      'priority': 3
    },
    {
      'eid': 18535,
      'tech': True,
      'name': 'LB 353 - Kenya',
      'priority': 3
    },
    {
      'eid': 18536,
      'tech': True,
      'name': 'LB 359 - Vietnam',
      'priority': 3
    },
  ],
  # [ # some presentation rooms don't have tables, so we wont look at those
  #   {
  #     'eid': 18529,
  #     'tech': True,
  #     'name': 'LB 311 - Haiti',
  #     'priority': 4
  #   },
  #   {
  #     'eid': 18530,
  #     'tech': True,
  #     'name': 'LB 316 - Australia',
  #     'priority': 4
  #   },
  #   {
  #     'eid': 18532,
  #     'tech': True,
  #     'name': 'LB 327 - Syria',
  #     'priority': 4
  #   },
  #   {
  #     'eid': 18533,
  #     'tech': True,
  #     'name': 'LB 328 - Zimbabwae',
  #     'priority': 4
  #   },
  # ],
  [
    {
      'eid': 18510,
      'tech': True,
      'name': 'LB 451 - Brazil',
      'priority': 4
    },
    {
      'eid': 18512,
      'tech': True,
      'name': 'LB 453 - Japan',
      'priority': 4
    },
    {
      'eid': 18523,
      'tech': True,
      'name': 'LB 459 - Italy',
      'priority': 4
    },
  ],
  [
    {
      'eid': 18524,
      'tech': True,
      'name': 'LB 518 - Ukraine',
      'priority': 5
    },
    {
      'eid': 18525,
      'tech': True,
      'name': 'LB 520 - South Africa',
      'priority': 5
    },
    {
      'eid': 18526,
      'tech': True,
      'name': 'LB 522 - Peru',
      'priority': 5
    },
    {
      'eid': 18511,
      'tech': True,
      'name': 'LB 547 - Lithuania',
      'priority': 5
    },
    {
      'eid': 18528,
      'tech': True,
      'name': 'LB 583 - Poland',
      'priority': 5
    },
  ]
]