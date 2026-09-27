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

/* =========================
   CHALLENGES AUS SUPABASE LADEN
========================= */

async function challengeLaden() {

    const { data, error } = await supabaseClient
        .from("challenges")
        .select("id, name")
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

    console.log(
        "Aktuelle Challenge:",
        data[0].name
    );
}

let fischarten = [];


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

const teilnehmerAuswahl =
    document.getElementById("teilnehmerAuswahl");

const fortschrittText =
    document.getElementById("fortschrittText");

const fortschrittBalken =
    document.getElementById("fortschrittBalken");

const rangliste =
    document.getElementById("rangliste");

const darkModeButton =
    document.getElementById("darkModeButton");

const resetButton =
    document.getElementById("resetButton");


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

    teilnehmerAuswahl.innerHTML = "";

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


            const option =
                document.createElement("option");

            option.value = name;

            option.textContent = name;

            teilnehmerAuswahl.appendChild(option);

        }
    );

    if (aktuellerTeilnehmer) {

        teilnehmerAuswahl.value =
            aktuellerTeilnehmer;

    }

}


/* =========================
   AUSWAHL TEILNEHMER
========================= */

teilnehmerAuswahl.addEventListener(
    "change",
    function() {

        aktuellerTeilnehmer =
            teilnehmerAuswahl.value;

        anzeigen();

    }
);


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
                    function() {

                        daten.faenge[
                            aktuellerTeilnehmer
                        ] =
                            faenge.filter(
                                function(eintrag) {

                                    return eintrag.fisch !== fisch;

                                }
                            );

                        speichern();

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


                        if (laenge === "") {

                            alert(
                                "Bitte eine Fanglänge eingeben."
                            );

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
    ]);

if (error) {

    alert(
        "Fehler beim Speichern des Fangs:\n\n" +
        error.message
    );

    return;
}

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

}


/* =========================
   RANGLISTE
========================= */

function ranglisteAnzeigen() {

    rangliste.innerHTML = "";


    const ergebnisse =
        daten.teilnehmer.map(
            function(name) {

                return {

                    name: name,

                    anzahl:
                        daten.faenge[name].length

                };

            }
        );


    ergebnisse.sort(
        function(a, b) {

            return b.anzahl - a.anzahl;

        }
    );


    ergebnisse.forEach(
        function(ergebnis, index) {

            const eintrag =
                document.createElement("div");

            eintrag.classList.add(
                "ranglisten-eintrag"
            );


            const rang =
                document.createElement("span");

            rang.classList.add("rang");

            rang.textContent =
                (index + 1) + ".";


            const name =
                document.createElement("span");

            name.textContent =
                ergebnis.name;


            const punkte =
                document.createElement("strong");

            punkte.textContent =
                ergebnis.anzahl +
                " Arten";


            eintrag.appendChild(rang);

            eintrag.appendChild(name);

            eintrag.appendChild(punkte);


            rangliste.appendChild(eintrag);

        }
    );

}


/* =========================
   ALLES AKTUALISIEREN
========================= */

function anzeigen() {

    teilnehmerAnzeigen();

    fischeAnzeigen();

    fortschrittAnzeigen();

    ranglisteAnzeigen();

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

    await challengeLaden();

    await teilnehmerAusSupabaseLaden();

    await fischartenAusSupabaseLaden();

    await faengeAusSupabaseLaden();

    anzeigen();
}

alert("Revision L");

startApp();