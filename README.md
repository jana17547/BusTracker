## **Bus Tracker**

Sajt je predvidjen za pracenje autobuskih tura. Moguce je startovati turu tako sto se popune odgovarajuci podaci u gornjem levom delu sajta i klikom na dugme **Start tour**. Nakon klika pocece simulacija ture koja moze, zajedno sa prethodnim turama, da se prikaze odabirom tipa ture i godine koje je ta tura pokrenuta.

Nakon sto se prikazu ture odredjenog tipa i iz zadate godine, postoji mogucnost klika na bilo koju od njih. Nakon klika ce se prikazati dodatni podaci kao sto su: **Fuel**, **Idling time**, **Speed** i **Location**, koji se beleze na svake 5 sekunde i simuliraju prikupljanje podataka sa senzora u vozilu.

Partition key za dostave je TourDescription i year. TourDescription je odabran zato sto je parametar po kojem bi se najcesce vrsila pretraga, kao i godina u kojoj je dostava izrvrsena. Godina takodje ogranicava rast particije.

Clustering key za dostave je departing time i tour id. Particija je sortirana po departing time-u a tour id cini kljuc jedinstevnim.

Za **Fuel**, **Idling time**, **Speed** i **Location** partition key je tour id, a clusterin key je reading time.

**VAZNO**
Baza je u cloudu i postoji mogucnost da ce da se pauzira posto je baza besplatna.
