// let positions = ["utg", "utg+1", "utg+2", "lj", "hj", "co", "btn", "sb", "bb"];
let positions = ["bb","sb","btn","co","hj","utg"];


function createSelect(txt, callback, avail) {
  let select = document.createElement("div");
  select.textContent = txt;
  select.classList.toggle("select");
  select.appendChild(document.createElement("br"));
  for (let p of positions) {
    let b = document.createElement("button");
    if (avail.indexOf(p) == -1) {
      b.disabled = true;
    }
    b.textContent = p;
    b.addEventListener("click", () => {
      callback(p, b);
      for (let c of select.children) {
        c.style.fontWeight = "normal";
      }
      b.style.fontWeight = "bold";
    });
    select.appendChild(b);
  }
  select.appendChild(document.createElement("br"));

  return select;
}
function rank(i) {
  let r = i + 2;
  if (r == 10) {
    r = "T";
  } else if (r == 11) {
    r = "J";
  } else if (r == 12) {
    r = "Q";
  } else if (r == 13) {
    r = "K";
  } else if (r == 14) {
    r = "A";
  }
  return "" + r;
}
let bg_colors = ["white", "green", "red", "blue"];
let colors = ["black", "white", "white", "white"];

function render_range(range) {
  if (!range) {
    range = new Int32Array(13 * 13);
  }
  let div = document.getElementById("range");
  div.innerHTML = "";

  for (let c0 = 12; c0 >= 0; --c0) {
    let row = document.createElement("div");
    for (let c1 = 12; c1 >= 0; --c1) {
      let col = document.createElement("span");
      if (c0 > c1) {
        col.textContent = rank(c0) + rank(c1) + "s ";
      } else if (c1 > c0) {
        col.textContent = rank(c1) + rank(c0) + "o ";
      } else {
        col.textContent = rank(c1) + rank(c0); // + "⠀ ";
      }
      col.style.background = bg_colors[range[c0 * 13 + c1]];
      col.style.color = colors[range[c0 * 13 + c1]];
      row.appendChild(col);
    }
    div.appendChild(row);
  }
}

window.addEventListener("load", function() {
  let preset = ["hj"];
  console.log(window.location.hash);
  if (window.location.hash && window.location.hash.slice(1)) {
    preset = window.location.hash.slice(1).split(",");
  }

  var xhr = new XMLHttpRequest();
  let url = "https://jott.live/raw/ranges_hit";
  xhr.open("GET", url, true);
  xhr.send(null);

  console.log(preset);
  render_range();

  let s2 = null;
  let s3 = null;

  let s1 = createSelect(
    "you're sitting in...",
    function(p1, b) {
      if (s2) {
        s2.remove();
      }
      if (s3) {
        s3.remove();
      }
      window.location.hash = p1;

      if (range_list[0][p1]) {
        render_range(range_list[0][p1]);
      } else {
        render_range();
      }
      s2 = createSelect(
        "raised by",
        function(p2, b) {
          if (s3) {
            s3.remove();
          }
          window.location.hash = p1 + "," + p2;

          if (p1 != p2) {
            render_range(range_list[1][p1][p2]);
          } else {
            render_range(range_list[0][p1]);

            s3 = createSelect(
              "3-bet by",
              function(p3) {
                render_range(range_list[2][p1][p3]);
                window.location.hash = p1 + "," + p2 + "," + p3;
              },
              Object.keys(range_list[2][p1])
            );
            document.body.appendChild(s3);
          }
        },
        (range_list[1][p1] ? Object.keys(range_list[1][p1]) : []).concat([p1])
      );
      document.body.appendChild(s2);
    },
    positions
  );
  document.body.appendChild(s1);
  let bs = s1.querySelectorAll("button");
  for (let b of bs) {
    if (preset.length && b.textContent == preset[0]) {
      b.click();
    }
  }
  setTimeout(function() {
    if (s2 && preset.length > 1) {
      let bs = s2.querySelectorAll("button");
      for (let b of bs) {
        if (b.textContent == preset[1]) {
          b.click();
        }
      }
    }
    setTimeout(function() {
      if (s3 && preset.length > 2) {
        let bs = s3.querySelectorAll("button");
        for (let b of bs) {
          if (b.textContent == preset[2]) {
            b.click();
          }
        }
      }
    }, 10);
  }, 10);
  /*
  you're sitting in --
  and then -- raises
  and then -- raises
  */
});
