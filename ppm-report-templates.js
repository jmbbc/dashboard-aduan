// Checklist definitions shared with the PPM report viewer. Source: ppm-form.html.
window.PPMReportTemplates = {
  "bilikSuis": {
    "category": "Electrical",
    "referenceNo": "BC/MAINT/BS/22/1",
    "frequency": "Monthly",
    "statusCode": "OK / NG",
    "statusOptions": [
      "OK",
      "NG"
    ],
    "description": "Template based on sheet ELEKT - SWITCH ROOM, including Main Switchboard Building, Main Switchboard, and Others sections.",
    "locationLabel": "Block Location",
    "locations": [
      "SSB Block A",
      "SSB Block B1",
      "SSB Block B2",
      "SSB Block B3",
      "LV Room A",
      "LV Room B"
    ],
    "groups": [
      {
        "title": "1) MAIN SWITCHBOARD BUILDING - A) CLEANING",
        "items": [
          "Clean main switch room",
          "Entrance route",
          "Roof top area"
        ]
      },
      {
        "title": "1) MAIN SWITCHBOARD BUILDING - B) INSPECTION",
        "items": [
          "Main entrance door",
          "No-entry warning sign",
          "Danger warning sign",
          "First aid diagram",
          "Electrical schematic wiring diagram",
          "Fire suppression gas canister",
          "EFR/OCR protection device",
          "Rubber safety mat",
          "Insect barrier net",
          "Earthing"
        ]
      },
      {
        "title": "2) MAIN SWITCHBOARD - A) INSPECTION",
        "items": [
          "Switchboard condition",
          "ACB air circuit breaker operation",
          "Indicator lights",
          "Selector switch",
          "Voltmeter",
          "Ammeter",
          "Power factor meter",
          "Cable condition",
          "Heater",
          "Capacitor bank"
        ]
      },
      {
        "title": "2) MAIN SWITCHBOARD - B) CHECK AND TIGHTEN",
        "items": [
          "All screws and terminals"
        ]
      },
      {
        "title": "2) MAIN SWITCHBOARD - C) RECORD READINGS IN LOGBOOK",
        "items": [
          "Voltage (1-Phase, R-N / Y-N / B-N)",
          "Voltage (3-Phase, R-Y / Y-B / B-R)",
          "Current (R / Y / B)",
          "Power factor",
          "Maximum load"
        ]
      },
      {
        "title": "3) OTHERS",
        "items": [
          "Fire extinguisher",
          "OCR / EFR"
        ]
      }
    ]
  },
  "waterPump": {
    "category": "Electrical",
    "referenceNo": "BC/MAINT/WP/1",
    "frequency": "Monthly",
    "statusCode": "OK / NG",
    "statusOptions": [
      "OK",
      "NG"
    ],
    "description": "Template based on sheet ELEKT - WATER PUMP (Manual Operation and Physical Check).",
    "locationLabel": "Pump Unit (Block / Pump No.)",
    "locations": [
      "Main Pump - Block A - Pump #1",
      "Main Pump - Block A - Pump #2",
      "Pressure Pump - Block A - Pump #1",
      "Pressure Pump - Block A - Pump #2",
      "Pressure Pump - Block A - Pump #3",
      "Main Pump - Block B1 - Pump #1",
      "Main Pump - Block B1 - Pump #2",
      "Pressure Pump - Block B1 - Pump #1",
      "Pressure Pump - Block B1 - Pump #2",
      "Pressure Pump - Block B1 - Pump #3",
      "Main Pump - Block B2 - Pump #1",
      "Main Pump - Block B2 - Pump #2",
      "Pressure Pump - Block B2 - Pump #1",
      "Pressure Pump - Block B2 - Pump #2",
      "Pressure Pump - Block B2 - Pump #3",
      "Main Pump - Block B3 - Pump #1",
      "Main Pump - Block B3 - Pump #2",
      "Pressure Pump - Block B3 - Pump #1",
      "Pressure Pump - Block B3 - Pump #2",
      "Pressure Pump - Block B3 - Pump #3"
    ],
    "groups": [
      {
        "title": "A) MANUAL OPERATION",
        "items": [
          "Incoming water pressure",
          "Outgoing water pressure",
          "Determine flow rate",
          "Check mechanical seal for leakage",
          "Check alignment between pump and motor",
          "Check casing and base plate for signs of corrosion",
          "Check bolt and nut for tightness",
          "Check for abnormal sound or vibration",
          "Clean all cooling air passages and external fins at motor",
          "Lubricate bearing when necessary"
        ]
      },
      {
        "title": "B) PHYSICAL CHECK",
        "items": [
          "Voltage",
          "Motor",
          "Full load current",
          "Overload setting",
          "All valves are correctly installed and in open position",
          "Check pump alignment",
          "Running AMP (Phase R / Y / B)",
          "Tighten",
          "Selector switch"
        ]
      }
    ]
  },
  "swimmingPump": {
    "category": "Electrical",
    "referenceNo": "BC/MAINT/PWP/1",
    "frequency": "Monthly",
    "statusCode": "OK / NG",
    "statusOptions": [
      "OK",
      "NG"
    ],
    "description": "Template based on sheet ELEKT - SWIMMING WATER PUMP (Manual Operation and Physical Check).",
    "locationLabel": "Pump Unit",
    "locations": [
      "Swimming Pool Pump #1",
      "Swimming Pool Pump #2"
    ],
    "groups": [
      {
        "title": "A) MANUAL OPERATION",
        "items": [
          "Incoming water pressure",
          "Outgoing water pressure",
          "Determine flow rate",
          "Check mechanical seal for leakage",
          "Check alignment between pump and motor",
          "Check casing and base plate for signs of corrosion",
          "Check bolt and nut for tightness",
          "Check for abnormal sound or vibration",
          "Clean all cooling air passages and external fins at motor",
          "Lubricate bearing when necessary"
        ]
      },
      {
        "title": "B) PHYSICAL CHECK",
        "items": [
          "Voltage",
          "Motor",
          "Full load current",
          "Overload setting",
          "All valves are correctly installed and in open position",
          "Check pump alignment",
          "Running AMP (Phase R / Y / B)",
          "Tighten",
          "Selector switch"
        ]
      }
    ]
  },
  "standbyGenset": {
    "category": "Electrical",
    "referenceNo": "BC/MAINT/GS/1",
    "frequency": "Monthly",
    "statusCode": "OK / NG",
    "statusOptions": [
      "OK",
      "NG"
    ],
    "description": "Template based on sheet ELEKT - STANDBY GENSET (full monthly checklist).",
    "locationLabel": "Genset Unit",
    "locations": [
      "S. Genset #1",
      "S. Genset #2"
    ],
    "groups": [
      {
        "title": "A) STANDBY GENSET CHECKLIST",
        "items": [
          "Check diesel fuel level in tank. Top up when necessary. Check fuel supply and return piping for leakage",
          "Check coolant level and top up if necessary",
          "Check engine oil level and top up if necessary",
          "Check battery electrolyte level and top up if necessary",
          "Check battery condition, terminal and connection",
          "Condition of hoses",
          "Check fan belt and adjust tension when necessary",
          "Check charging alternator",
          "Start up engine and warm up engine",
          "Check engine instrumentation",
          "Check engine protection system (LOP, HWT)",
          "Clean up genset and AMF switchboard",
          "Check genset voltage and frequency and readjust when necessary",
          "Check AMF switchboard and battery charger",
          "RPM",
          "Oil pressure",
          "Water temperature",
          "Drain and change lubricating oil",
          "Change lubricating oil filter",
          "Change fuel filter elements",
          "Service/change air filter element"
        ]
      }
    ]
  },
  "capacitorBank": {
    "category": "Electrical",
    "referenceNo": "BC/MAINT/CB/1",
    "frequency": "Monthly",
    "statusCode": "OK / NG",
    "statusOptions": [
      "OK",
      "NG"
    ],
    "description": "Template based on sheet ELEKT - CAPACITOR BANK (Mechanical + ACB1 phase readings).",
    "locationLabel": "LV Room Block",
    "locations": [
      "A",
      "B1",
      "B2",
      "B3"
    ],
    "groups": [
      {
        "title": "A) MECHANICAL",
        "items": [
          "MCCB / ACB",
          "Contactor",
          "Regulator Switch",
          "Control Fuse",
          "Indicator Light",
          "Power Factor Meter",
          "Power Factor Regulator",
          "Connection Cable",
          "Capacitor"
        ]
      },
      {
        "title": "B) CAPACITOR BANK - ACB 1 (PHASE R / Y / B)",
        "items": [
          "Step 1 (25 kVar) (MCCB : 40 A)",
          "Step 2 (25 kVar) (MCCB : 40 A)",
          "Step 3 (25 kVar) (MCCB : 40 A)",
          "Step 4 (25 kVar) (MCCB : 40 A)",
          "Step 5 (25 kVar) (MCCB : 40 A)",
          "Step 6 (25 kVar) (MCCB : 40 A)",
          "Step 7 (50 kVar) (MCCB : 100 A)",
          "Step 8 (50 kVar) (MCCB : 100 A)",
          "Step 9 (50 kVar) (MCCB : 100 A)",
          "Step 10 (50 kVar) (MCCB : 100 A)",
          "Step 11 (100 kVar) (MCCB : 175 A)",
          "Step 12 (100 kVar) (MCCB : 175 A)"
        ]
      }
    ]
  },
  "mechExhaustFan": {
    "category": "Mechanical",
    "referenceNo": "BC/MAINT/EXHF/1",
    "frequency": "Monthly",
    "statusCode": "OK / NG",
    "statusOptions": [
      "OK",
      "NG"
    ],
    "description": "Template based on sheet MECH - EXHAUST FAN (physical checks by room location).",
    "locationLabel": "Room Location",
    "locations": [
      "Pump Room (Main Pump)",
      "Pump Room (Pressure Pump)",
      "LV Room A",
      "LV Room B",
      "S.Pool Pump Room",
      "Lift Motor Room A",
      "Lift Motor Room B1",
      "Lift Motor Room B2",
      "Lift Motor Room B3"
    ],
    "groups": [
      {
        "title": "A) PHYSICAL CHECK",
        "items": [
          "Check bolt and nut for tightness",
          "Check for abnormal sound or vibration",
          "Check casing for signs of corrosion",
          "Lubricate bearing",
          "Check switchboard and wiring",
          "Inlet and outlet grilles are fitted",
          "Damper is fully open",
          "Flexible connection is fitted and undamaged",
          "Fan hung on anti-vibration devices"
        ]
      }
    ]
  },
  "ffWaterTank": {
    "category": "Fire Fighting",
    "referenceNo": "BC/MAINT/WT/1",
    "frequency": "Monthly",
    "statusCode": "OK / NG",
    "statusOptions": [
      "OK",
      "NG"
    ],
    "description": "Template based on sheet FF - WATER TANK (status checks per tank location).",
    "locationLabel": "Tank Location",
    "locations": [
      "Suction Tank (JBA)",
      "Fire Tank (PG)",
      "Domestic Tank Rooftop Block A",
      "Domestic Tank Rooftop Block B1",
      "Domestic Tank Rooftop Block B2",
      "Domestic Tank Rooftop Block B3"
    ],
    "groups": [
      {
        "title": "A) STATUS CHECK",
        "items": [
          "Piping",
          "Valve",
          "Water level indicator",
          "Tank condition",
          "Painting",
          "Ball valve",
          "Sensor rod",
          "Float switch",
          "Check valve",
          "Ladder"
        ]
      }
    ]
  },
  "ffAlarmPanel": {
    "category": "Fire Fighting",
    "referenceNo": "BC/MAINT/FCR/1",
    "frequency": "Monthly",
    "statusCode": "OK / NG",
    "statusOptions": [
      "OK",
      "NG"
    ],
    "description": "Template based on sheet FF - FIRE CONTROL ROOM, alarm panel section only.",
    "locationLabel": "Room Location",
    "locations": [
      "Fire Control Room"
    ],
    "groups": [
      {
        "title": "A) FIRE ALARM PANEL",
        "items": [
          "Floor plan",
          "Indicator light (testing)",
          "Volt meter",
          "Amp meter",
          "CMS",
          "Cable connection",
          "Battery cell / charger (service)",
          "Zone switch (ISO/N/TA/TF test)",
          "Buzzer",
          "Master reset",
          "Bell (testing)",
          "Break glass (testing)",
          "Smoke detector (testing)",
          "Heat detector (testing)",
          "Flow switch (testing)"
        ]
      }
    ]
  },
  "ffFireControlRoom": {
    "category": "Fire Fighting",
    "referenceNo": "BC/MAINT/FCR/1",
    "frequency": "Monthly",
    "statusCode": "OK / NG",
    "statusOptions": [
      "OK",
      "NG"
    ],
    "description": "Template based on sheet FF - FIRE CONTROL ROOM (fire alarm panel and intercom panel).",
    "locationLabel": "Room Location",
    "locations": [
      "Fire Control Room"
    ],
    "groups": [
      {
        "title": "A) FIRE ALARM PANEL",
        "items": [
          "Floor plan",
          "Indicator light (testing)",
          "Volt meter",
          "Amp meter",
          "CMS",
          "Cable connection",
          "Battery cell / charger (service)",
          "Zone switch (ISO/N/TA/TF test)",
          "Buzzer",
          "Master reset",
          "Bell (testing)",
          "Break glass (testing)",
          "Smoke detector (testing)",
          "Heat detector (testing)",
          "Flow switch (testing)"
        ]
      },
      {
        "title": "B) INTERCOM PANEL",
        "items": [
          "Voltage",
          "Ampere",
          "Battery cell",
          "Battery charger",
          "Indicator light (testing)",
          "Call button",
          "Phone (testing)"
        ]
      }
    ]
  },
  "ffWaterRiser": {
    "category": "Fire Fighting",
    "referenceNo": "BC/MAINT/WAT/1",
    "frequency": "Quarterly",
    "statusCode": "OK / NG",
    "statusOptions": [
      "OK",
      "NG"
    ],
    "description": "Template based on sheet FF - WATER RISER (inspection and cut-in/cut-out testing).",
    "locationLabel": "Location",
    "locations": [
      "Water Riser Room"
    ],
    "groups": [
      {
        "title": "1) INSPECTION",
        "items": [
          "Room security",
          "Lighting",
          "Room temperature",
          "Contactor",
          "Isolator switch / MCCB",
          "Start / Stop button",
          "Indicator light",
          "Cable connection",
          "Pump condition",
          "Pressure control switch",
          "Pressure gauge",
          "Check valve",
          "Battery"
        ]
      },
      {
        "title": "2) TESTING (CUT-IN / CUT-OUT)",
        "items": [
          "Jockey Pump",
          "Duty Pump",
          "Standby Pump"
        ]
      }
    ]
  },
  "ffWetRiser": {
    "category": "Fire Fighting",
    "referenceNo": "BC/MAINT/WET/1",
    "frequency": "Monthly",
    "statusCode": "OK / NG",
    "statusOptions": [
      "OK",
      "NG"
    ],
    "description": "Template based on sheet FF - WET RISER with added bracket, control valve, lamp, and picture references.",
    "step2ScopeNote": "Scope of inspection: Hose Reel (Canvas), Nozzle & Coupling, Hose Reel Bracket, Fire Extinguisher, Wet Riser Pipe (Control Valve), Lamp.",
    "locationLabel": "Block Location",
    "locations": [
      "A",
      "B1",
      "B2",
      "B3"
    ],
    "groups": [
      {
        "title": "1) INSPECTION BY LEVEL",
        "items": [
          "Level PG",
          "Level P1",
          "Level P2",
          "Level P3",
          "Level PL",
          "Level 1",
          "Level 2",
          "Level 3",
          "Level 4",
          "Level 5",
          "Level 6",
          "Level 7",
          "Level 8",
          "Level 9",
          "Level 10",
          "Level 11",
          "Level 12",
          "Level 13",
          "Level 14",
          "Level 15",
          "Level 16",
          "Level 17"
        ]
      }
    ]
  },
  "civilRiserLeaking": {
    "category": "Civil",
    "referenceNo": "BC/MAINT/CIVIL/1",
    "frequency": "Monthly",
    "statusCode": "OK / NG",
    "statusOptions": [
      "OK",
      "NG"
    ],
    "description": "Template based on sheet CIVIL - RISER LEAKING CHECK (multi-room inspection by level).",
    "step2ScopeNote": "Room scope: Bilik Meter Air, Bilik Pancur Basah, Bilik MATV, Bilik Saluran Telefon, Bilik Panel Meter, Bilik Saluran Elektrik, Bilik Gegelung Hos, Tangga Kecemasan.",
    "locationLabel": "Block Location",
    "locations": [
      "A",
      "B1",
      "B2",
      "B3"
    ],
    "groups": [
      {
        "title": "1) INSPECTION BY LEVEL",
        "items": [
          "Level PG",
          "Level P1",
          "Level P2",
          "Level P3",
          "Level PL",
          "Level 1",
          "Level 2",
          "Level 3",
          "Level 4",
          "Level 5",
          "Level 6",
          "Level 7",
          "Level 8",
          "Level 9",
          "Level 10",
          "Level 11",
          "Level 12",
          "Level 13",
          "Level 14",
          "Level 15",
          "Level 16",
          "Level 17"
        ]
      }
    ]
  },
  "civilWallLeaking": {
    "category": "Civil",
    "referenceNo": "BC/MAINT/CIVIL/2",
    "frequency": "Monthly",
    "statusCode": "OK / NG",
    "statusOptions": [
      "OK",
      "NG"
    ],
    "description": "Template based on sheet CIVIL - WALL LEAKING CHECKING (block wall condition by level).",
    "locationLabel": "Block Location",
    "locations": [
      "A",
      "B1",
      "B2",
      "B3"
    ],
    "groups": [
      {
        "title": "1) WALL LEAKING INSPECTION BY LEVEL",
        "items": [
          "Level PG",
          "Level P1",
          "Level P2",
          "Level P3",
          "Level PL",
          "Level 1",
          "Level 2",
          "Level 3",
          "Level 4",
          "Level 5",
          "Level 6",
          "Level 7",
          "Level 8",
          "Level 9",
          "Level 10",
          "Level 11",
          "Level 12",
          "Level 13",
          "Level 14",
          "Level 15",
          "Level 16",
          "Level 17"
        ]
      }
    ]
  },
  "plToilet": {
    "category": "Plumbing",
    "referenceNo": "BC/MAINT/PLUM/T/1",
    "frequency": "Monthly",
    "statusCode": "OK / NG",
    "statusOptions": [
      "OK",
      "NG"
    ],
    "description": "Template based on sheet PL-TOILET (public toilet fixture checks by location).",
    "locationLabel": "Toilet Location",
    "locations": [
      "Pejabat",
      "Rumah Kelab",
      "Gim",
      "Rumah Sampah B1",
      "Rumah Sampah B3",
      "Pos Kawalan"
    ],
    "groups": [
      {
        "title": "1) PILI AIR",
        "items": [
          "Periksa sebarang kebocoran pada pili air",
          "Tiada lelehan air apabila kepala paip ditutup rapat",
          "Periksa tekanan air (tidak terlalu kuat / perlahan)",
          "Tiada karat pada sekitar pili air",
          "Pastikan kepala pili air berfungsi dengan baik (tidak terlalu ketat / longgar)"
        ]
      },
      {
        "title": "2) MANGKUK TANDAS",
        "items": [
          "Pastikan tiada kebocoran sekitar mangkuk tandas",
          "Periksa tangki mangkuk tandas bagi sebarang bunyi atau kebocoran",
          "Pastikan pam tandas berfungsi dengan baik",
          "Periksa paras air dalam tangki di tahap maksimum selepas dipam",
          "Periksa tempat duduk tandas dalam keadaan baik",
          "Pastikan penutup dan tempat duduk diikat kemas (tidak bergoyang)",
          "Pastikan saluran paip tidak tersumbat"
        ]
      },
      {
        "title": "3) KEPALA PANCURAN (SHOWER HEAD)",
        "items": [
          "Pastikan kepala pancuran dalam keadaan baik dan tidak retak",
          "Pastikan tekanan air yang keluar tidak terlalu kuat / perlahan",
          "Pastikan kawasan pancuran tiada lumut / karat",
          "Pastikan saliran air pancuran kering (air tidak bertakung)"
        ]
      }
    ]
  }
};
