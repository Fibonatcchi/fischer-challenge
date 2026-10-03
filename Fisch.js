/* ========================
   FISCHARTEN
========================= */

const SUPABASE_URL = "https://lcugqumvscjjukxqhphf.supabase.co";
const SUPABASE_KEY = "sb_publishable_KWnK3KdWYn8fVNfR6iEWug_5XrM64Ol";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let aktuelleChallengeId = null;
let challengeStartdatum = null;
let challengeStartzeit = null;
let challengeEnddatum = null;
let challengeEndzeit = null;

/* =========================
   CHALLENGES AUS SUPABASE LADEN
========================= */

async function challengeLaden() {

    const { data, error } = await supabaseClient
        .from("challenges")
        .select("id, name, startdatum, startzeit, enddatum, endzeit")
        .limit(1);

    if (error) {
        alert(
            "Fehler beim Laden der Challenge: " +
            error.message
        );
        return;
    }

    if (data.length === 0) {
        alert("Keine Challenge gefunden.");
        return;
    }

    aktuelleChallengeId = data[0].id;
    challengeTitel.textContent = data[0].name;
    challengeStartdatum = data[0].startdatum;
    challengeStartzeit = data[0].startzeit;
    challengeEnddatum = data[0].enddatum;
    challengeEndzeit = data[0].endzeit;

console.log(
    "Challenge:",
    data[0].name
);

console.log(
    "Start:",
    data[0].startdatum
);

console.log(
    "Ende:",
    data[0].enddatum
);

    console.log(
        "Aktuelle Challenge:",
        data[0].name
    );

  console.log(
    "Challenge-Status:",
    challengeStatus()
);
}

let fischarten = [];

/* =========================
   CHALLENGE STATUS
========================= */

function challengeStatus() {

    const heute =
        new Date();

    const start =
    new Date(
        challengeStartdatum +
        "T" +
        challengeStartzeit
    );

    const ende =
    new Date(
        challengeEnddatum +
        "T" +
        challengeEndzeit
    );

    if (heute < start) {
        return "noch nicht gestartet";
    }

    if (heute > ende) {
        return "beendet";
    }

    return "läuft";
}

/* =========================
   FANGERLAUBNIS
========================= */

function fangErlaubt() {

    const jetzt = new Date();

    const start =
        new Date(
            challengeStartdatum +
            "T" +
            challengeStartzeit
        );

    const ende =
        new Date(
            challengeEnddatum +
            "T" +
            challengeEndzeit
        );

    return jetzt >= start && jetzt <= ende;
}

/* =========================
   CHALLENGE INFO ANZEIGEN
========================= */

function challengeInfoAnzeigen() {

    if (!challengeInfo) {
        return;
    }

    const start =
    new Date(
        challengeStartdatum +
        "T" +
        challengeStartzeit
    );

    const ende =
        new Date(
            challengeEnddatum + 
          "T" +
          challengeEndzeit
        );

    const datumFormat =
        new Intl.DateTimeFormat(
            "de-CH",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

    const zeitraum =
    datumFormat.format(start) +
    " " +
    start.toLocaleTimeString(
        "de-CH",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    ) +
    " – " +
    datumFormat.format(ende) +
    " " +
    ende.toLocaleTimeString(
        "de-CH",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

    const status =
        challengeStatus();

    let statusText = "";

    if (status === "noch nicht gestartet") {

    const jetzt = new Date();

    const differenz =
        start - jetzt;

    const tage =
        Math.floor(
            differenz / (1000 * 60 * 60 * 24)
        );

    const stunden =
        Math.floor(
            (differenz / (1000 * 60 * 60)) % 24
        );

    const minuten =
        Math.floor(
            (differenz / (1000 * 60)) % 60
        );

    statusText =
        "🟡 Challenge startet in: " +
        tage + " Tagen, " +
        stunden + " Stunden und " +
        minuten + " Minuten";

} else if (status === "läuft") {

    const jetzt = new Date();

    const ende =
    new Date(
        challengeEnddatum +
        "T" +
        challengeEndzeit
        );

    const differenz =
        ende - jetzt;

    const stunden =
        Math.floor(
            differenz / (1000 * 60 * 60)
        );

    const minuten =
        Math.floor(
            (differenz / (1000 * 60)) % 60
        );

    statusText =
        "🟢 Challenge endet in: " +
        stunden + " Stunden und " +
        minuten + " Minuten";

} else {

        statusText =
            "🔴 Challenge ist beendet";
    }

    challengeInfo.innerHTML =
        "<div>" +
        zeitraum +
        "</div>" +
        "<div>" +
        statusText +
        "</div>";
}

/* =========================
   START STATUS ANZEIGEN
========================= */

function startStatusAnzeigen() {

    const startStatus =
        document.getElementById("startStatus");

    const startZeitraum =
        document.getElementById("startZeitraum");

    if (!startStatus || !startZeitraum) {
        return;
    }

    const start =
        new Date(
            challengeStartdatum +
            "T" +
            challengeStartzeit
        );

    const ende =
        new Date(
            challengeEnddatum +
            "T" +
            challengeEndzeit
        );

    const datumFormat =
        new Intl.DateTimeFormat(
            "de-CH",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

    const zeitraum =
        datumFormat.format(start) +
        " " +
        start.toLocaleTimeString(
            "de-CH",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        ) +
        " – " +
        datumFormat.format(ende) +
        " " +
        ende.toLocaleTimeString(
            "de-CH",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    startZeitraum.textContent = zeitraum;

    const status =
        challengeStatus();

    if (status === "noch nicht gestartet") {
        startStatus.textContent =
            "🟡 Challenge startet bald";
    }

    if (status === "läuft") {
        startStatus.textContent =
            "🟢 Challenge läuft";
    }

    if (status === "beendet") {
        startStatus.textContent =
            "🔴 Challenge beendet";
    }
}

/* =========================
   DATEN LADEN
========================= */

let daten = JSON.parse(
    localStorage.getItem("fischerChallenge")
);


/* =========================
   FALLS NOCH KEINE DATEN
========================= */

if (!daten) {

    daten = {
        teilnehmer: [],
        faenge: {}
    };

}


/* =========================
   HTML-ELEMENTE
========================= */

const fischListe =
    document.getElementById("fischListe");

const teilnehmerListe =
    document.getElementById("teilnehmerListe");

const teilnehmerInput =
    document.getElementById("teilnehmerInput");

const teilnehmerHinzufuegen =
    document.getElementById("teilnehmerHinzufuegen");

const fortschrittText =
    document.getElementById("fortschrittText");

const fortschrittBalken =
    document.getElementById("fortschrittBalken");

const anzahlTeilnehmer =
    document.getElementById("anzahlTeilnehmer");

const anzahlGefangeneArten =
    document.getElementById("anzahlGefangeneArten");

const rangliste =
    document.getElementById("rangliste");

const darkModeButton =
    document.getElementById("darkModeButton");

const resetButton =
    document.getElementById("resetButton");

const challengeInfo =
    document.getElementById("challengeInfo");

const challengeTitel =
    document.getElementById("challengeTitel");


/* =========================
   AKTUELLER TEILNEHMER
========================= */

let aktuellerTeilnehmer = null;


/* =========================
   DATEN SPEICHERN
========================= */

function speichern() {

    localStorage.setItem(
        "fischerChallenge",
        JSON.stringify(daten)
    );

}

/* =========================
   TEILNEHMER AUS SUPABASE LADEN
========================= */

async function teilnehmerAusSupabaseLaden() {

    const { data, error } = await supabaseClient
        .from("teilnehmer")
        .select("id, name")
        .order("name");

    if (error) {
        alert(
            "TEILNEHMER-FEHLER:\n\n" +
            error.message
        );
        return;
    }

    daten.teilnehmer = data.map(function(teilnehmer) {
        return teilnehmer.name;
    });

    daten.teilnehmerIds = {};

    data.forEach(function(teilnehmer) {
        daten.teilnehmerIds[teilnehmer.name] =
            teilnehmer.id;
    });

    daten.teilnehmer.forEach(function(name) {

    if (!daten.faenge[name]) {
        daten.faenge[name] = [];
    }

});

if (daten.teilnehmer.length > 0) {
    aktuellerTeilnehmer =
        daten.teilnehmer[0];
}
}

/* =========================
   FAENGE AUS SUPABASE LADEN
========================= */

async function faengeAusSupabaseLaden() {

    const { data, error } = await supabaseClient
        .from("faenge")
        .select(`
            id,
            teilnehmer_id,
            fischart_id,
            laenge,
            zeitpunkt
        `);

    if (error) {
        alert(
            "Fehler beim Laden der Fänge:\n\n" +
            error.message
        );
        return;
    }

console.log("SUPABASE FÄNGE:", data);
console.log("TEILNEHMER:", daten.teilnehmer);
console.log("TEILNEHMER IDS:", daten.teilnehmerIds);
console.log("FISCHARTEN:", fischarten);
  
    data.forEach(function(fang) {

    const teilnehmerName =
        daten.teilnehmer.find(function(name) {
            return daten.teilnehmerIds[name] === fang.teilnehmer_id;
        });

    const fischart =
        fischarten.find(function(fisch) {
            return fisch.id === fang.fischart_id;
        });

    if (!teilnehmerName || !fischart) {
        return;
    }

    daten.faenge[teilnehmerName].push({
        fisch: fischart.name,
        fischartId: fischart.id,
        laenge: Number(fang.laenge),
        datum:
            new Date(fang.zeitpunkt)
            .toLocaleDateString("de-CH"),
        supabaseId: fang.id
    });

});
}

/* =========================
   FISCHARTEN AUS SUPABASE LADEN
========================= */

async function fischartenAusSupabaseLaden() {

    const { data, error } = await supabaseClient
        .from("fischarten")
        .select("id, name");

    if (error) {
        alert(
            "Fehler beim Laden der Fischarten: " +
            error.message
        );
        return;
    }

    fischarten = data;

    alert("Revision B – Fischarten geladen:\n\n" + fischarten.join("\n"));
}

/* =========================
   TEILNEHMER HINZUFÜGEN
========================= */

teilnehmerHinzufuegen.addEventListener(
    "click",
    async function() {

        const name =
            teilnehmerInput.value.trim();

        if (name === "") {
            return;
        }

        // Prüfen, ob der Name bereits existiert
        if (daten.teilnehmer.includes(name)) {
            alert("Dieser Teilnehmer existiert bereits.");
            return;
        }

        // Teilnehmer in Supabase speichern
        const { data, error } = await supabaseClient
            .from("teilnehmer")
            .insert([
                {
                    name: name,
                    challenge_id: aktuelleChallengeId
                }
            ])
            .select()
            .single();

        if (error) {
            alert(
                "Fehler beim Hinzufügen: " +
                error.message
            );
            return;
        }

        // Teilnehmer lokal für die Anzeige übernehmen
        daten.teilnehmer.push(data.name);

        if (!daten.faenge[data.name]) {
            daten.faenge[data.name] = [];
        }

        if (!daten.teilnehmerIds) {
            daten.teilnehmerIds = {};
        }

        daten.teilnehmerIds[data.name] = data.id;

        aktuellerTeilnehmer = data.name;

        teilnehmerInput.value = "";

        anzeigen();
    }
);


/* =========================
   TEILNEHMER ANZEIGEN
========================= */

function teilnehmerAnzeigen() {

    teilnehmerListe.innerHTML = "";

    daten.teilnehmer.forEach(
        function(name) {

            const button =
                document.createElement("button");

            button.textContent = name;

            button.classList.add(
                "teilnehmer-button"
            );

            if (name === aktuellerTeilnehmer) {

                button.classList.add("aktiv");

            }

            button.addEventListener(
                "click",
                function() {

                    aktuellerTeilnehmer = name;

                    anzeigen();

                }
            );

            teilnehmerListe.appendChild(button);


        }
    );

}


/* =========================
   FISCHE ANZEIGEN
========================= */

function fischeAnzeigen() {

    fischListe.innerHTML = "";

    if (!aktuellerTeilnehmer) {

        fischListe.innerHTML =
            "<p>Bitte zuerst einen Teilnehmer auswählen.</p>";

        return;

    }


    const faenge =
        daten.faenge[aktuellerTeilnehmer];


    fischarten.forEach(
        function(fisch) {

            const karte =
                document.createElement("div");

            karte.classList.add("fisch");


            const fang =
                faenge.find(
                    function(eintrag) {

                        return eintrag.fisch === fisch.name;

                    }
                );


            if (fang) {

                karte.classList.add("gefangen");

            }


            const titel =
                document.createElement("h3");

            titel.textContent = fisch.name;

          const bild =
    document.createElement("div");

bild.classList.add("fisch-bild");

bild.innerHTML = `
    <img
        src="bilder/${fisch.name}.png"
        alt="${fisch.name}"
        class="fisch-silhouette"
    >
`;


            const status =
                document.createElement("p");

            status.classList.add("status");


            if (fang) {

                status.textContent =
                    "Gefangen – " +
                    fang.laenge +
                    " cm";

            } else {

                status.textContent =
                    "Noch nicht gefangen";

            }


            karte.appendChild(titel);

            karte.appendChild(bild);

            karte.appendChild(status);


            if (fang) {

                const datum =
                    document.createElement("p");

                datum.classList.add(
                    "fang-datum"
                );

                datum.textContent =
                    "Gefangen am " +
                    fang.datum;

                karte.appendChild(datum);


                const loeschen =
                    document.createElement("button");

                loeschen.textContent =
                    "Fang löschen";

                loeschen.classList.add(
                    "loeschen-button"
                );


   loeschen.addEventListener(
    "click",
    async function() {

        const { error } = await supabaseClient
            .from("faenge")
            .delete()
            .eq("id", fang.supabaseId);

        if (error) {
            alert(
                "Fehler beim Löschen des Fangs:\n\n" +
                error.message
            );
            return;
        }

        daten.faenge[
            aktuellerTeilnehmer
        ] =
            faenge.filter(
                function(eintrag) {
                    return eintrag.supabaseId !== fang.supabaseId;
                }
            );

        anzeigen();
    }
);


                karte.appendChild(loeschen);

            } else {

                const fangButton =
                    document.createElement("button");

                fangButton.textContent =
                    "Fang eintragen";

                fangButton.classList.add(
                    "fang-button"
                );


                const eingabe =
                    document.createElement("div");

                eingabe.classList.add(
                    "eingabe"
                );


                const input =
                    document.createElement("input");

                input.type = "number";

                input.placeholder =
                    "Länge in cm";

                input.min = "1";


                const speichernButton =
                    document.createElement("button");

                speichernButton.textContent =
                    "Speichern";


                fangButton.addEventListener(
                    "click",
                    function() {

                        eingabe.style.display =
                            "block";

                        fangButton.style.display =
                            "none";

                        input.focus();

                    }
                );


                speichernButton.addEventListener(
                    "click",
                    async function() {

                        const laenge =
                            input.value;

    if (!fangErlaubt()) {

    alert(
        "Ein Fang kann nur während der laufenden Challenge eingetragen werden."
    );

    eingabe.style.display = "none";
    fangButton.style.display = "block";
    input.value = "";

    return;
           }


            if (laenge === "") {

             alert("Bitte eine Fanglänge eingeben.");

            return;

                        }


                  const neuerFang = {

                  fisch: fisch.name,
                  fischartId: fisch.id,
                  laenge: Number(laenge),

                  datum: new Date()
                  .toLocaleDateString(
                 "de-CH"
                                )

                        };


    const { data, error } = await supabaseClient
    .from("faenge")
    .insert([
        {
            teilnehmer_id:
                daten.teilnehmerIds[aktuellerTeilnehmer],

            fischart_id:
                neuerFang.fischartId,

            laenge:
                neuerFang.laenge
        }
    ])
    .select()
    .single();

if (error) {

    alert(
        "Fehler beim Speichern des Fangs:\n\n" +
        error.message
    );

    return;
}

neuerFang.supabaseId = data.id;

daten.faenge[
    aktuellerTeilnehmer
].push(neuerFang);

anzeigen();

                    }
                );


  eingabe.appendChild(input);

  eingabe.appendChild(speichernButton);


  karte.appendChild(fangButton);

  karte.appendChild(eingabe);

            }


 fischListe.appendChild(karte);

        }
    );

}


/* =========================
   FORTSCHRITT
========================= */

function fortschrittAnzeigen() {

    if (!aktuellerTeilnehmer) {

        fortschrittText.textContent =
            "0 von " +
            fischarten.length +
            " Arten";

        fortschrittBalken.style.width =
            "0%";

        return;

    }


    const anzahl =
        daten.faenge[
            aktuellerTeilnehmer
        ].length;


    const prozent =
        (anzahl / fischarten.length) * 100;


    fortschrittText.textContent =
        anzahl +
        " von " +
        fischarten.length +
        " Arten";


    fortschrittBalken.style.width =
        prozent + "%";

      anzahlTeilnehmer.textContent =
        daten.teilnehmer.length;

    let verschiedeneArten = new Set();

    daten.teilnehmer.forEach(function(name) {

        daten.faenge[name].forEach(function(fang) {

            verschiedeneArten.add(fang.fischartId);

        });

    });

    anzahlGefangeneArten.textContent =
        verschiedeneArten.size;

}

/* =========================
   PUNKTE BERECHNEN
========================= */

function punkteBerechnen() {

    const punkte = {};

    daten.teilnehmer.forEach(function(name) {
        punkte[name] = 0;
    });

    fischarten.forEach(function(fisch) {

        const faengeDieserArt = [];

        daten.teilnehmer.forEach(function(name) {

            const fang = daten.faenge[name].find(
                function(eintrag) {
                    return eintrag.fischartId === fisch.id;
                }
            );

            if (fang) {
                faengeDieserArt.push({
                    teilnehmer: name,
                    laenge: fang.laenge
                });
            }

        });

        if (faengeDieserArt.length === 0) {
            return;
        }

        // 1 Punkt für das Fangen der Fischart
        faengeDieserArt.forEach(function(fang) {
            punkte[fang.teilnehmer] += 1;
        });

        // Zusatzpunkt für Zander, Seeforelle und Hecht
        if (
            fisch.name === "Zander" ||
            fisch.name === "Seeforelle" ||
            fisch.name === "Hecht"
        ) {
            faengeDieserArt.forEach(function(fang) {
                punkte[fang.teilnehmer] += 1;
            });
        }

        // +1 Punkt für den grössten Fisch dieser Art
// aber nur, wenn mindestens zwei Teilnehmer
// diese Fischart gefangen haben

if (faengeDieserArt.length >= 2) {

    faengeDieserArt.sort(
        function(a, b) {
            return b.laenge - a.laenge;
        }
    );

    punkte[
        faengeDieserArt[0].teilnehmer
    ] += 1;
}
    });

    return punkte;
}

/* =========================
   RANGLISTE ANZEIGEN
========================= */

function ranglisteAnzeigen() {

    rangliste.innerHTML = "";

    const punkte =
        punkteBerechnen();

    const ergebnisse =
        daten.teilnehmer.map(
            function(name) {

                return {
                    name: name,
                    punkte: punkte[name] || 0
                };

            }
        );

    ergebnisse.sort(
        function(a, b) {
            return b.punkte - a.punkte;
        }
    );

    ergebnisse.forEach(
    function(ergebnis, index) {

        const eintrag =
            document.createElement("div");

        eintrag.classList.add(
            "ranglisten-eintrag"
        );

        // Platz-Klasse für die ersten drei Plätze
        if (index === 0) {
            eintrag.classList.add("platz-1");
        } else if (index === 1) {
            eintrag.classList.add("platz-2");
        } else if (index === 2) {
            eintrag.classList.add("platz-3");
        }

        const anzahlFischarten =
    daten.faenge[ergebnis.name].length;

eintrag.innerHTML =
    "<strong>" +
    (index + 1) +
    ". " +
    ergebnis.name +
    "</strong>" +
    "<span class=\"ranglisten-arten\">" +
    anzahlFischarten +
    " Arten" +
    "</span>" +
    "<span class=\"ranglisten-punkte\">" +
    ergebnis.punkte +
    " Punkte" +
    "</span>";

        rangliste.appendChild(
            eintrag
        );

    }
);
  
}

/* =========================
   AKTUELLEN TEILNEHMER ANZEIGEN
========================= */

function aktuellerTeilnehmerAnzeigen() {

  console.log("AKTUELLER TEILNEHMER WIRD ANGEZEIGT");

    const rangElement =
        document.getElementById("teilnehmerRang");

    const punkteElement =
        document.getElementById("teilnehmerPunkte");

    const artenElement =
        document.getElementById("teilnehmerArten");

    const fanglisteElement =
        document.getElementById("teilnehmerFangliste");

    if (
        !rangElement ||
        !punkteElement ||
        !artenElement ||
        !fanglisteElement
    ) {
        return;
    }

    if (!aktuellerTeilnehmer) {

        rangElement.textContent = "-";
        punkteElement.textContent = "0";
        artenElement.textContent = "0";
        fanglisteElement.innerHTML =
            "<p>Noch kein Teilnehmer ausgewählt.</p>";

        return;
    }

    /* Punkte berechnen */
    const punkte =
        punkteBerechnen();

    const aktuellePunkte =
        punkte[aktuellerTeilnehmer] || 0;


    /* Rang berechnen */
    const ergebnisse =
        daten.teilnehmer.map(function(name) {

            return {
                name: name,
                punkte: punkte[name] || 0
            };

        });

    ergebnisse.sort(function(a, b) {

        return b.punkte - a.punkte;

    });

    const rang =
        ergebnisse.findIndex(function(ergebnis) {

            return ergebnis.name === aktuellerTeilnehmer;

        }) + 1;


    /* Gefangene Arten */
    const faenge =
        daten.faenge[aktuellerTeilnehmer] || [];

    const anzahlArten =
        faenge.length;


    /* Werte anzeigen */
    rangElement.textContent =
        rang + ". Platz";

    punkteElement.textContent =
        aktuellePunkte + " Punkte";

    artenElement.textContent =
        anzahlArten;


    /* Fangliste */
    fanglisteElement.innerHTML = "";

    if (faenge.length === 0) {

        fanglisteElement.innerHTML =
            "<p>Noch keine Fänge eingetragen.</p>";

        return;
    }


    faenge.forEach(function(fang) {

        const eintrag =
            document.createElement("div");

        eintrag.classList.add(
            "teilnehmer-fang"
        );

        eintrag.innerHTML =
            "<strong>" +
            fang.fisch +
            "</strong>" +
            "<span>" +
            fang.laenge +
            " cm" +
            "</span>";

        fanglisteElement.appendChild(
            eintrag
        );

    });

}

/* =========================
   GRÖSSTER FANG ANZEIGEN
========================= */

function groesstenFangAnzeigen() {

    const groessterFangElement =
        document.getElementById("groessterFang");

    if (!groessterFangElement) {
        return;
    }

    let groessterFang = null;
    let groessterTeilnehmer = null;

    daten.teilnehmer.forEach(function(name) {

        if (!daten.faenge[name]) {
            return;
        }

        daten.faenge[name].forEach(function(fang) {

            if (
                !groessterFang ||
                fang.laenge > groessterFang.laenge
            ) {

                groessterFang = fang;
                groessterTeilnehmer = name;

            }

        });

    });

    if (!groessterFang) {

        groessterFangElement.textContent =
            "Noch kein Fang eingetragen.";

        return;
    }

    groessterFangElement.innerHTML =
        "<strong>" +
        groessterFang.fisch +
        "</strong>" +

        "<span>" +
        groessterFang.laenge +
        " cm · " +
        groessterTeilnehmer +
        "</span>";
}

/* =========================
   START RANGLISTE ANZEIGEN
========================= */

function startRanglisteAnzeigen() {

    const startRangliste =
        document.getElementById("startRangliste");

    if (!startRangliste) {
        return;
    }

    startRangliste.innerHTML = "";

    const punkte =
        punkteBerechnen();

    const ergebnisse =
        daten.teilnehmer.map(function(name) {

            return {
                name: name,
                punkte: punkte[name] || 0,
                arten:
                    daten.faenge[name]
                        ? daten.faenge[name].length
                        : 0
            };

        });

    ergebnisse.sort(function(a, b) {

        return b.punkte - a.punkte;

    });

    ergebnisse
        .slice(0, 3)
        .forEach(function(ergebnis, index) {

            const eintrag =
                document.createElement("div");

            eintrag.classList.add(
                "start-ranglisten-eintrag"
            );

            if (index === 0) {
                eintrag.classList.add("platz-1");
            }

            if (index === 1) {
                eintrag.classList.add("platz-2");
            }

            if (index === 2) {
                eintrag.classList.add("platz-3");
            }

            eintrag.innerHTML =
                "<strong>" +
                (index + 1) +
                ". " +
                ergebnis.name +
                "</strong>" +

                "<span>" +
                ergebnis.arten +
                " Arten · " +
                ergebnis.punkte +
                " Punkte" +
                "</span>";

            startRangliste.appendChild(
                eintrag
            );

        });
}

/* =========================
   ALLES AKTUALISIEREN
========================= */

function anzeigen() {

    teilnehmerAnzeigen();

    fischeAnzeigen();

    fortschrittAnzeigen();

    ranglisteAnzeigen();

    startRanglisteAnzeigen();

    groesstenFangAnzeigen();

  console.log("TEST: anzeigen() läuft");

    aktuellerTeilnehmerAnzeigen();

}


/* =========================
   DARK MODE
========================= */

darkModeButton.addEventListener(
    "click",
    function() {

        document.body.classList.toggle("dark");

    }
);


/* =========================
   RESET
========================= */

resetButton.addEventListener(
    "click",
    function() {

        const bestaetigung =
            confirm(
                "Wirklich die komplette Challenge löschen?"
            );


        if (!bestaetigung) {

            return;

        }


        localStorage.removeItem(
            "fischerChallenge"
        );


        daten = {

            teilnehmer: [],

            faenge: {}

        };


        aktuellerTeilnehmer = null;

        anzeigen();

    }
);


/* =========================
   START
========================= */

async function startApp() {

    console.log("TEST 1: startApp gestartet");

    await challengeLaden();

    console.log("TEST 2: challengeLaden fertig");

    challengeInfoAnzeigen();

    startStatusAnzeigen();

    await teilnehmerAusSupabaseLaden();

    console.log("TEST 3: Teilnehmer geladen");

    await fischartenAusSupabaseLaden();

    console.log("TEST 4: Fischarten geladen");

    await faengeAusSupabaseLaden();

    console.log("TEST 5: Fänge geladen");

    anzeigen();

    console.log("TEST 6: anzeigen() wurde aufgerufen");

    anzeigen();

  setInterval(function() {
    challengeInfoAnzeigen();
}, 60000);
  
}

alert("TEST Fisch.js wird geladen");

console.log("FISCH.JS ERREICHT TESTSTELLE");

startApp();

/* =========================
   SEITENNAVIGATION
========================= */

const navigationsButtons =
    document.querySelectorAll(".hauptnavigation button");

const seiten =
    document.querySelectorAll(".bereich");

function seiteAnzeigen(seitenName) {

    seiten.forEach(function(seite) {
        seite.classList.add("seite-versteckt");
    });

    let zielSeite = null;

    if (seitenName === "start") {
        zielSeite = document.getElementById("seiteStart");
    }

    if (seitenName === "fische") {
        zielSeite = document.getElementById("seiteFische");
    }

    if (seitenName === "teilnehmer") {
        zielSeite = document.getElementById("seiteTeilnehmer");
    }

    if (seitenName === "einstellungen") {
        zielSeite = document.getElementById("seiteEinstellungen");
    }

  if (seitenName === "regeln") {
    zielSeite = document.getElementById("seiteRegeln");
  }

    if (zielSeite) {
        zielSeite.classList.remove("seite-versteckt");
    }

    navigationsButtons.forEach(function(button) {
        button.classList.remove("aktiv");
    });

    const aktiverButton =
        document.querySelector(
            '[data-seite="' + seitenName + '"]'
        );

    if (aktiverButton) {
        aktiverButton.classList.add("aktiv");
    }
}


navigationsButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        seiteAnzeigen(button.dataset.seite);

    });

});


seiteAnzeigen("start");