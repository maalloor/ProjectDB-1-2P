`CREATE TABLE flight (
        flightid    INT64 NOT NULL,
        flightsource   STRING(20) NOT NULL,
        flightdest    STRING(20) NOT NULL,
        flightdate  DATE NOT NULL
      ) PRIMARY KEY (flightdate, flightid)`,
      `CREATE TABLE seat (
        seatid     INT64 NOT NULL,
        flightid   INT64,
        seatnumber    INT64 NOT NULL,
        seatcost   FLOAT64 NOT NULL,
        CONSTRAINT FK_Seat_Flight FOREIGN KEY (flightid) REFERENCES flight (flightid)
      ) PRIMARY KEY (seatnumber, seatid)`,
      `CREATE TABLE booking (
        bookingid    INT64 NOT NULL,
        seatid       INT64,
        flightid     INT64 NOT NULL,
        bookdate  DATE NOT NULL,
        CONSTRAINT FK_Booking_Flight FOREIGN KEY (flightid) REFERENCES flight (flightid),
        CONSTRAINT FK_Booking_Seat FOREIGN KEY (seatid) REFERENCES seat (seatid),
      ) PRIMARY KEY (bookdate DESC, seatid, flightid, bookingid)`,
      `CREATE TABLE passenger (
        passid    INT64 NOT NULL,
        passname   STRING(50) NOT NULL,
        passemail  STRING(50),
        passdob DATE NOT NULL
      ) PRIMARY KEY (passdob DESC, passid)`,
      `CREATE TABLE bookingdetails (
        bookingid    INT64 NOT NULL,
        passid     INT64 NOT NULL,
        CONSTRAINT FK_Bookingdetails_Booking FOREIGN KEY (bookingid) REFERENCES booking (bookingid),
        CONSTRAINT FK_Bookingdetails_Passenger FOREIGN KEY (passid) REFERENCES passenger (passid)
      ) PRIMARY KEY (passid, bookingid)`