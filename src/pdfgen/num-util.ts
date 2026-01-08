let n0 = 0;
let n1 = 0;
let n2 = 0;

const n_umeri = new Array(28);
let vst0 = "";

for (let i = 0; i <= 20; i++) {
  n_umeri[i] = i;
}
n_umeri[21] = 30;
n_umeri[22] = 40;
n_umeri[23] = 50;
n_umeri[24] = 60;
n_umeri[25] = 70;
n_umeri[26] = 80;
n_umeri[27] = 90;
n_umeri[28] = 1000;

const l_ettera = [
  "zero",
  "uno",
  "due",
  "tre",
  "quattro",
  "cinque",
  "sei",
  "sette",
  "otto",
  "nove",
  "dieci",
  "undici",
  "dodici",
  "tredici",
  "quattordici",
  "quindici",
  "sedici",
  "diciassette",
  "diciotto",
  "diciannove",
  "venti",
  "trenta",
  "quaranta",
  "cinquanta",
  "sessanta",
  "settanta",
  "ottanta",
  "novanta",
  "mille",
];

export default function conv_iac(fn: number) {
  n0 = 0;
  n1 = 0;
  n2 = 0;
  let resto = 0;
  let vsc = 0;
  vst0 = "";
  let vst2 = "";
  let vst3 = "";
  let vst4 = "";
  let vst5 = "";
  resto = (fn * 100) % 100;
  let fl = "";
  let fi = Math.floor(fn);
  vsc = cerca(fi, n_umeri);

  if (vsc == -1) {
    if (fi >= 1000000000) {
      n0 = Math.floor(fn / 1000000000);
      dividi();
      fi = fn % 1000000000;
      if (n1 == 1) vst5 = "unmiliardo";
      else vst5 = vst0 + "miliardi";
    }

    if (fi >= 1000000) {
      n0 = Math.floor(fn / 1000000);
      dividi();
      fi = fi % 1000000;
      if (n1 == 1) vst4 = "unmilione";
      else vst4 = vst0 + "milioni";
    }

    if (fi >= 1000) {
      n0 = Math.floor(fn / 1000);
      dividi();
      fi = fi % 1000;

      if (n1 == 1 && n2 == 0) vst3 = "mille";
      else vst3 = vst0 + "mila";
    }

    if (fi < 1000) {
      n0 = fi;
      dividi();
      vst2 = vst0;
    }

    fl = vst5 + vst4 + vst3 + vst2;
  } else {
    fl = l_ettera[vsc] ?? "";
  }
  let restoString = "" + resto;
  if (resto < 10) restoString = "0" + resto;
  return fl + "/" + restoString;
}

function cerca(fn: number, arra: number[]): number {
  for (let i = 0; i < arra.length; i++) {
    if (fn == arra[i]) return i;
  }
  return -1;
}

function dividi() {
  let nd;
  let vsc;

  n1 = n0 % 100;
  n0 = Math.floor(n0 / 100);
  n2 = n0 % 10;
  n0 = Math.floor(n0 / 10);

  if (n2 != 0) {
    vsc = cerca(n2, n_umeri);
    if (n2 == 1) vst0 = "cento";
    else vst0 = l_ettera[vsc] + "cento";
  }

  if (n1 != 0) {
    vsc = cerca(n1, n_umeri);

    if (vsc == -1) {
      nd = Math.floor(n1 / 10) * 10;

      vsc = cerca(nd, n_umeri);

      nd = n1 - nd;

      if (nd == 1 || nd == 8)
        vst0 =
          vst0 +
          l_ettera[vsc]?.slice(
            n2 != 0 && l_ettera[vsc]?.startsWith("o") ? 1 : 0,
            -1
          );
      else
        vst0 =
          vst0 +
          l_ettera[vsc]?.slice(
            n2 != 0 && l_ettera[vsc]?.startsWith("o") ? 1 : 0
          );

      vsc = cerca(nd, n_umeri);

      vst0 = vst0 + l_ettera[vsc];
    } else {
      vst0 = vst0 + l_ettera[vsc];
    }
  }
}
