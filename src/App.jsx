import { useState, useEffect, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";

/* ══════════════════════════════════════════════
   SEED DATA
══════════════════════════════════════════════ */
const MOVIES = [
  { id:1,  title:"The Shawshank Redemption", year:1994, genre:"Drama",   director:"Frank Darabont",       runtime:142, rating:9.3, votes:2841000, synopsis:"Two imprisoned men bond over years, finding solace and eventual redemption through acts of common decency." },
  { id:2,  title:"The Godfather",             year:1972, genre:"Crime",   director:"Francis Ford Coppola", runtime:175, rating:9.2, votes:1974000, synopsis:"The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son." },
  { id:3,  title:"The Dark Knight",           year:2008, genre:"Action",  director:"Christopher Nolan",    runtime:152, rating:9.0, votes:2614000, synopsis:"Batman faces the Joker, a criminal mastermind who wishes to plunge Gotham City into anarchy." },
  { id:4,  title:"Pulp Fiction",              year:1994, genre:"Crime",   director:"Quentin Tarantino",    runtime:154, rating:8.9, votes:2098000, synopsis:"The lives of two mob hitmen intertwine in four tales of violence and redemption in Los Angeles." },
  { id:5,  title:"Schindler's List",          year:1993, genre:"Drama",   director:"Steven Spielberg",     runtime:195, rating:9.0, votes:1432000, synopsis:"In German-occupied Poland, Oskar Schindler saves over a thousand Jewish refugees from the Holocaust." },
  { id:6,  title:"Inception",                 year:2010, genre:"Sci-Fi",  director:"Christopher Nolan",    runtime:148, rating:8.8, votes:2406000, synopsis:"A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea." },
  { id:7,  title:"Parasite",                  year:2019, genre:"Thriller",director:"Bong Joon-ho",         runtime:132, rating:8.5, votes:1104000, synopsis:"Greed and class discrimination threaten the symbiotic relationship between the wealthy Park family and the destitute Kims." },
  { id:8,  title:"Interstellar",              year:2014, genre:"Sci-Fi",  director:"Christopher Nolan",    runtime:169, rating:8.6, votes:1946000, synopsis:"A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival." },
  { id:9,  title:"The Silence of the Lambs",  year:1991, genre:"Thriller",director:"Jonathan Demme",       runtime:118, rating:8.6, votes:1456000, synopsis:"A young FBI cadet must receive the help of an incarcerated cannibal killer to catch another killer." },
  { id:10, title:"Spirited Away",             year:2001, genre:"Fantasy", director:"Hayao Miyazaki",        runtime:125, rating:8.6, votes:780000,  synopsis:"A sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and her parents are turned into pigs." },
  { id:11, title:"Oldboy",                    year:2003, genre:"Mystery", director:"Park Chan-wook",        runtime:120, rating:8.4, votes:621000,  synopsis:"After being unexpectedly imprisoned for 15 years, a man is released and sets out to find his captor." },
  { id:12, title:"Whiplash",                  year:2014, genre:"Drama",   director:"Damien Chazelle",       runtime:107, rating:8.5, votes:897000,  synopsis:"A promising young drummer enrolls in a cutthroat music conservatory where his instructor will stop at nothing to see him succeed." },
];

const ACTORS = [
  { id:1,  name:"Tim Robbins",        born:1958, nationality:"American", movies:[1] },
  { id:2,  name:"Morgan Freeman",     born:1937, nationality:"American", movies:[1,3] },
  { id:3,  name:"Marlon Brando",      born:1924, nationality:"American", movies:[2] },
  { id:4,  name:"Al Pacino",          born:1940, nationality:"American", movies:[2] },
  { id:5,  name:"Christian Bale",     born:1974, nationality:"British",  movies:[3] },
  { id:6,  name:"Heath Ledger",       born:1979, nationality:"Australian",movies:[3] },
  { id:7,  name:"John Travolta",      born:1954, nationality:"American", movies:[4] },
  { id:8,  name:"Samuel L. Jackson",  born:1948, nationality:"American", movies:[4] },
  { id:9,  name:"Leonardo DiCaprio",  born:1974, nationality:"American", movies:[6] },
  { id:10, name:"Joseph Gordon-Levitt",born:1981,nationality:"American", movies:[6] },
  { id:11, name:"Jodie Foster",       born:1962, nationality:"American", movies:[9] },
  { id:12, name:"Anthony Hopkins",    born:1937, nationality:"British",  movies:[9] },
];

const RATINGS_DIST = [
  { star:"1★", count:12 }, { star:"2★", count:28 },
  { star:"3★", count:74 }, { star:"4★", count:189 },
  { star:"5★", count:312 }, { star:"6★", count:490 },
  { star:"7★", count:820 }, { star:"8★", count:1240 },
  { star:"9★", count:890 }, { star:"10★",count:560 },
];

const RATINGS_OVER_TIME = [
  { year:"2018", avg:7.8 }, { year:"2019", avg:8.1 },
  { year:"2020", avg:7.6 }, { year:"2021", avg:8.3 },
  { year:"2022", avg:8.5 }, { year:"2023", avg:8.7 },
  { year:"2024", avg:8.4 },
];

const GENRE_DATA = [
  { genre:"Drama",   count:3 }, { genre:"Crime",  count:2 },
  { genre:"Sci-Fi",  count:2 }, { genre:"Thriller",count:2 },
  { genre:"Action",  count:1 }, { genre:"Fantasy", count:1 },
  { genre:"Mystery", count:1 },
];

const ACTOR_RADAR = [
  { attr:"Drama",    score:90 }, { attr:"Thriller", score:75 },
  { attr:"Action",   score:65 }, { attr:"Comedy",   score:40 },
  { attr:"Sci-Fi",   score:70 }, { attr:"Crime",    score:85 },
];

const PIE_COLORS = ["#C9A84C","#E8C96A","#F5E29A","#A07830","#7A5A20","#4A3210","#D4B870","#8B6E2E"];

/* ══════════════════════════════════════════════
   CUSTOM TOOLTIP
══════════════════════════════════════════════ */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:"rgba(10,8,4,0.95)",border:"1px solid #C9A84C44",padding:"10px 16px",borderRadius:4,fontFamily:"'Playfair Display',serif"}}>
      <p style={{color:"#C9A84C",fontWeight:700,marginBottom:4,fontSize:13}}>{label}</p>
      {payload.map((p,i) => (
        <p key={i} style={{color:"#E8D5A0",fontSize:12,margin:0}}>{p.name}: <span style={{color:"#fff"}}>{p.value}</span></p>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════
   STAR RATING COMPONENT
══════════════════════════════════════════════ */
const StarRating = ({ value, onChange, size=20 }) => {
  const [hover, setHover] = useState(0);
  return (
    <div style={{display:"flex",gap:4,cursor:onChange?"pointer":"default"}}>
      {[1,2,3,4,5,6,7,8,9,10].map(s => (
        <span key={s}
          onMouseEnter={() => onChange && setHover(s)}
          onMouseLeave={() => onChange && setHover(0)}
          onClick={() => onChange && onChange(s)}
          style={{
            fontSize:size, lineHeight:1,
            color: s <= (hover||value) ? "#C9A84C" : "#3A3020",
            transition:"color 0.15s, transform 0.1s",
            transform: s <= (hover||value) ? "scale(1.15)" : "scale(1)",
            display:"inline-block",
          }}
        >★</span>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════
   PILL / BADGE
══════════════════════════════════════════════ */
const Badge = ({ children, color="#C9A84C" }) => (
  <span style={{
    display:"inline-block", padding:"2px 10px", borderRadius:2,
    border:`1px solid ${color}55`, color, fontSize:11,
    fontFamily:"'Courier New',monospace", letterSpacing:1, textTransform:"uppercase",
  }}>{children}</span>
);

/* ══════════════════════════════════════════════
   MOVIE CARD
══════════════════════════════════════════════ */
const MovieCard = ({ movie, onClick, selected }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onClick(movie)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor:"pointer", position:"relative", overflow:"hidden",
        borderRadius:3, border:`1px solid ${selected ? "#C9A84C" : hovered ? "#C9A84C66" : "#2A2010"}`,
        background: selected ? "linear-gradient(135deg,#1A1408,#2A1E08)" : hovered ? "#141008" : "#0D0A04",
        transition:"all 0.25s", transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? "0 12px 40px rgba(201,168,76,0.15)" : selected ? "0 0 0 1px #C9A84C33" : "none",
        padding:"0",
      }}
    >
      {/* Film-strip accent */}
      <div style={{
        position:"absolute", top:0, left:0, width:4, height:"100%",
        background: selected ? "#C9A84C" : hovered ? "#C9A84C88" : "#1A1408",
        transition:"background 0.25s",
      }}/>
      <div style={{padding:"14px 14px 14px 18px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{
              fontFamily:"'Playfair Display',serif", fontWeight:700,
              fontSize:14, color: hovered||selected ? "#E8D5A0" : "#C8B87A",
              lineHeight:1.3, marginBottom:4,
              whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
            }}>{movie.title}</div>
            <div style={{fontFamily:"'Courier New',monospace",fontSize:10,color:"#6A5A30",letterSpacing:1}}>
              {movie.year} · {movie.genre} · {movie.runtime}m
            </div>
          </div>
          <div style={{
            flexShrink:0, fontFamily:"'Playfair Display',serif", fontWeight:900,
            fontSize:20, color: movie.rating >= 9 ? "#F5D060" : movie.rating >= 8.5 ? "#C9A84C" : "#8B7A40",
            textShadow: movie.rating >= 9 ? "0 0 20px #C9A84C88" : "none",
          }}>{movie.rating}</div>
        </div>
        <div style={{
          marginTop:8, fontSize:11, color:"#5A4A20", lineHeight:1.5,
          display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden",
          fontFamily:"Georgia,serif",
        }}>{movie.synopsis}</div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   MOVIE DETAIL PANEL
══════════════════════════════════════════════ */
const MovieDetail = ({ movie, actors, onRate, userRatings }) => {
  const [myRating, setMyRating] = useState(userRatings[movie.id] || 0);
  const [submitted, setSubmitted] = useState(!!userRatings[movie.id]);
  const [submitting, setSubmitting] = useState(false);
  const cast = actors.filter(a => a.movies.includes(movie.id));

  const handleSubmit = useCallback(() => {
    if (!myRating) return;
    setSubmitting(true);
    setTimeout(() => {
      onRate(movie.id, myRating);
      setSubmitted(true);
      setSubmitting(false);
    }, 600);
  }, [myRating, movie.id, onRate]);

  const barData = RATINGS_DIST.map(r => ({ ...r,
    fill: parseInt(r.star) >= Math.floor(movie.rating) ? "#C9A84C" : "#3A2E10"
  }));

  return (
    <div style={{height:"100%", overflowY:"auto", padding:"32px 28px"}}>
      {/* Header */}
      <div style={{marginBottom:24}}>
        <div style={{
          fontFamily:"'Playfair Display',serif", fontWeight:900,
          fontSize:28, color:"#E8D5A0", lineHeight:1.1, marginBottom:8,
          textShadow:"0 2px 20px rgba(201,168,76,0.2)",
        }}>{movie.title}</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",marginBottom:12}}>
          <Badge>{movie.genre}</Badge>
          <Badge color="#8B9070">{movie.year}</Badge>
          <Badge color="#7A8060">{movie.runtime} min</Badge>
        </div>
        <div style={{fontFamily:"'Courier New',monospace",fontSize:11,color:"#6A5A30",letterSpacing:0.5}}>
          DIR. {movie.director.toUpperCase()}
        </div>
      </div>

      {/* Rating hero */}
      <div style={{
        background:"linear-gradient(135deg,#1A1408,#0D0A04)",
        border:"1px solid #C9A84C33", borderRadius:4,
        padding:"20px 24px", marginBottom:20, display:"flex", gap:24, alignItems:"center",
      }}>
        <div style={{textAlign:"center"}}>
          <div style={{
            fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:52,
            color:"#F5D060", lineHeight:1, textShadow:"0 0 40px #C9A84C66",
          }}>{movie.rating}</div>
          <div style={{fontFamily:"'Courier New',monospace",fontSize:10,color:"#6A5A30",letterSpacing:1,marginTop:4}}>
            IMDb SCORE
          </div>
        </div>
        <div style={{flex:1}}>
          <div style={{marginBottom:6}}>
            <StarRating value={Math.round(movie.rating/2)} size={16}/>
          </div>
          <div style={{fontFamily:"'Courier New',monospace",fontSize:11,color:"#8A7040"}}>
            {(movie.votes/1000).toFixed(0)}K RATINGS
          </div>
        </div>
      </div>

      {/* Synopsis */}
      <div style={{
        fontSize:13, color:"#9A8A50", lineHeight:1.8, marginBottom:24,
        fontFamily:"Georgia,serif", fontStyle:"italic",
        borderLeft:"2px solid #C9A84C33", paddingLeft:16,
      }}>{movie.synopsis}</div>

      {/* Cast */}
      {cast.length > 0 && (
        <div style={{marginBottom:24}}>
          <div style={{
            fontFamily:"'Courier New',monospace", fontSize:10, color:"#6A5A30",
            letterSpacing:2, textTransform:"uppercase", marginBottom:10,
          }}>— Cast</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {cast.map(a => (
              <div key={a.id} style={{
                padding:"6px 12px", borderRadius:2,
                background:"#141008", border:"1px solid #2A2010",
                fontFamily:"'Playfair Display',serif", fontSize:12, color:"#C8B87A",
              }}>
                {a.name}
                <span style={{color:"#4A3A18",marginLeft:6,fontFamily:"'Courier New',monospace",fontSize:10}}>
                  b.{a.born}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating form */}
      <div style={{
        background:"#0D0A04", border:"1px solid #2A2010", borderRadius:4,
        padding:"18px 20px", marginBottom:24,
      }}>
        <div style={{
          fontFamily:"'Courier New',monospace", fontSize:10, color:"#6A5A30",
          letterSpacing:2, textTransform:"uppercase", marginBottom:12,
        }}>— Rate This Film</div>
        <div style={{marginBottom:12}}>
          <StarRating value={myRating} onChange={submitted ? null : setMyRating} size={22}/>
        </div>
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!myRating || submitting}
            style={{
              padding:"8px 20px", background: myRating ? "#C9A84C" : "#2A2010",
              color: myRating ? "#0D0A04" : "#4A3A18",
              border:"none", borderRadius:2, cursor: myRating ? "pointer" : "default",
              fontFamily:"'Courier New',monospace", fontSize:11, letterSpacing:2,
              textTransform:"uppercase", transition:"all 0.2s",
              fontWeight:700,
            }}
          >{submitting ? "SAVING…" : myRating ? `SUBMIT  ${myRating}/10` : "SELECT STARS"}</button>
        ) : (
          <div style={{
            fontFamily:"'Courier New',monospace", fontSize:11, color:"#C9A84C",
            letterSpacing:1,
          }}>✓ YOUR RATING: {myRating}/10 — RECORDED</div>
        )}
      </div>

      {/* Mini bar chart */}
      <div style={{marginBottom:8}}>
        <div style={{
          fontFamily:"'Courier New',monospace", fontSize:10, color:"#6A5A30",
          letterSpacing:2, textTransform:"uppercase", marginBottom:10,
        }}>— Rating Distribution</div>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={barData} margin={{top:0,right:0,bottom:0,left:-30}}>
            <XAxis dataKey="star" tick={{fill:"#4A3A18",fontSize:9,fontFamily:"Courier New"}} axisLine={false} tickLine={false}/>
            <YAxis hide/>
            <Bar dataKey="count" radius={[2,2,0,0]}>
              {barData.map((entry,i) => <Cell key={i} fill={entry.fill}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   CHARTS PAGE
══════════════════════════════════════════════ */
const ChartsPage = ({ movies }) => {
  const topMovies = [...movies].sort((a,b)=>b.rating-a.rating).slice(0,8);

  return (
    <div style={{padding:"24px 20px",overflowY:"auto",height:"100%"}}>
      <div style={{
        fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:22,
        color:"#C9A84C", marginBottom:24, letterSpacing:1,
      }}>Analytics & Insights</div>

      {/* Row 1 */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        {/* Top Rated */}
        <div style={{background:"#0D0A04",border:"1px solid #1A1408",borderRadius:4,padding:"16px 20px"}}>
          <div style={{fontFamily:"'Courier New',monospace",fontSize:10,color:"#6A5A30",letterSpacing:2,marginBottom:12}}>TOP RATED FILMS</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topMovies} layout="vertical" margin={{top:0,right:20,bottom:0,left:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1408" horizontal={false}/>
              <XAxis type="number" domain={[8,9.5]} tick={{fill:"#4A3A18",fontSize:9,fontFamily:"Courier New"}} axisLine={false}/>
              <YAxis type="category" dataKey="title" width={120}
                tick={{fill:"#8A7A40",fontSize:9,fontFamily:"Playfair Display"}}
                axisLine={false} tickLine={false}
                tickFormatter={v => v.length>16 ? v.slice(0,15)+"…" : v}
              />
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="rating" radius={[0,3,3,0]}>
                {topMovies.map((m,i) => (
                  <Cell key={i} fill={`hsl(42,${60+i*3}%,${35+i*3}%)`}/>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Genre Pie */}
        <div style={{background:"#0D0A04",border:"1px solid #1A1408",borderRadius:4,padding:"16px 20px"}}>
          <div style={{fontFamily:"'Courier New',monospace",fontSize:10,color:"#6A5A30",letterSpacing:2,marginBottom:12}}>GENRE DISTRIBUTION</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={GENRE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                dataKey="count" nameKey="genre" paddingAngle={3}>
                {GENRE_DATA.map((_,i) => <Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
              </Pie>
              <Tooltip content={<CustomTooltip/>}/>
              <Legend iconType="circle" iconSize={8}
                formatter={v => <span style={{fontFamily:"'Courier New',monospace",fontSize:10,color:"#8A7A40"}}>{v}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2 */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        {/* Ratings over time */}
        <div style={{background:"#0D0A04",border:"1px solid #1A1408",borderRadius:4,padding:"16px 20px"}}>
          <div style={{fontFamily:"'Courier New',monospace",fontSize:10,color:"#6A5A30",letterSpacing:2,marginBottom:12}}>AVG RATING OVER TIME</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={RATINGS_OVER_TIME} margin={{top:5,right:10,bottom:5,left:-20}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1408"/>
              <XAxis dataKey="year" tick={{fill:"#4A3A18",fontSize:9,fontFamily:"Courier New"}} axisLine={false}/>
              <YAxis domain={[7,9]} tick={{fill:"#4A3A18",fontSize:9,fontFamily:"Courier New"}} axisLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Line type="monotone" dataKey="avg" stroke="#C9A84C" strokeWidth={2}
                dot={{fill:"#C9A84C",r:4,strokeWidth:0}} activeDot={{r:6,fill:"#F5D060"}}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Actor radar */}
        <div style={{background:"#0D0A04",border:"1px solid #1A1408",borderRadius:4,padding:"16px 20px"}}>
          <div style={{fontFamily:"'Courier New',monospace",fontSize:10,color:"#6A5A30",letterSpacing:2,marginBottom:12}}>ACTOR GENRE AFFINITY · MORGAN FREEMAN</div>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart cx="50%" cy="50%" outerRadius={70} data={ACTOR_RADAR}>
              <PolarGrid stroke="#2A2010"/>
              <PolarAngleAxis dataKey="attr" tick={{fill:"#6A5A30",fontSize:9,fontFamily:"Courier New"}}/>
              <PolarRadiusAxis domain={[0,100]} tick={false} axisLine={false}/>
              <Radar name="Score" dataKey="score" stroke="#C9A84C" fill="#C9A84C" fillOpacity={0.2}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rating dist full */}
      <div style={{background:"#0D0A04",border:"1px solid #1A1408",borderRadius:4,padding:"16px 20px"}}>
        <div style={{fontFamily:"'Courier New',monospace",fontSize:10,color:"#6A5A30",letterSpacing:2,marginBottom:12}}>GLOBAL RATING DISTRIBUTION (ALL FILMS)</div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={RATINGS_DIST} margin={{top:0,right:0,bottom:0,left:-20}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A1408" vertical={false}/>
            <XAxis dataKey="star" tick={{fill:"#4A3A18",fontSize:10,fontFamily:"Courier New"}} axisLine={false}/>
            <YAxis tick={{fill:"#4A3A18",fontSize:9,fontFamily:"Courier New"}} axisLine={false}/>
            <Tooltip content={<CustomTooltip/>}/>
            <Bar dataKey="count" radius={[3,3,0,0]}>
              {RATINGS_DIST.map((_,i) => (
                <Cell key={i} fill={`hsl(42,${40+i*5}%,${28+i*4}%)`}/>
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   ACTORS PAGE
══════════════════════════════════════════════ */
const ActorsPage = ({ actors, movies }) => {
  const [selected, setSelected] = useState(null);
  const actor = selected ? actors.find(a=>a.id===selected) : null;
  const actorMovies = actor ? movies.filter(m=>actor.movies.includes(m.id)) : [];

  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",height:"100%",gap:0}}>
      {/* List */}
      <div style={{overflowY:"auto",borderRight:"1px solid #1A1408",padding:"16px"}}>
        <div style={{fontFamily:"'Courier New',monospace",fontSize:10,color:"#6A5A30",letterSpacing:2,marginBottom:12}}>ALL ACTORS ({actors.length})</div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {actors.map(a => (
            <div key={a.id} onClick={()=>setSelected(a.id)}
              style={{
                padding:"12px 14px", borderRadius:3, cursor:"pointer",
                background: selected===a.id ? "#1A1408" : "#0D0A04",
                border:`1px solid ${selected===a.id ? "#C9A84C55" : "#1A1408"}`,
                transition:"all 0.2s",
              }}>
              <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:13,color:"#C8B87A",marginBottom:3}}>{a.name}</div>
              <div style={{fontFamily:"'Courier New',monospace",fontSize:10,color:"#4A3A18",letterSpacing:1}}>
                b.{a.born} · {a.nationality} · {a.movies.length} film{a.movies.length!==1?"s":""}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Detail */}
      <div style={{overflowY:"auto",padding:"24px 20px"}}>
        {actor ? (
          <>
            <div style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:24,color:"#E8D5A0",marginBottom:6}}>{actor.name}</div>
            <div style={{fontFamily:"'Courier New',monospace",fontSize:10,color:"#6A5A30",letterSpacing:1,marginBottom:20}}>
              BORN {actor.born} · {actor.nationality.toUpperCase()}
            </div>
            <div style={{fontFamily:"'Courier New',monospace",fontSize:10,color:"#6A5A30",letterSpacing:2,marginBottom:10}}>— FILMOGRAPHY</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {actorMovies.map(m => (
                <div key={m.id} style={{
                  display:"flex",justifyContent:"space-between",alignItems:"center",
                  padding:"10px 14px", background:"#0D0A04",
                  border:"1px solid #1A1408", borderRadius:3,
                }}>
                  <div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,color:"#C8B87A",marginBottom:2}}>{m.title}</div>
                    <div style={{fontFamily:"'Courier New',monospace",fontSize:10,color:"#4A3A18"}}>{m.year} · {m.genre}</div>
                  </div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:18,color:"#C9A84C"}}>{m.rating}</div>
                </div>
              ))}
              {actorMovies.length === 0 && (
                <div style={{fontFamily:"'Courier New',monospace",fontSize:11,color:"#3A2E10"}}>No linked films in dataset.</div>
              )}
            </div>
          </>
        ) : (
          <div style={{
            height:"100%",display:"flex",alignItems:"center",justifyContent:"center",
            fontFamily:"'Playfair Display',serif",fontSize:16,color:"#2A2010",fontStyle:"italic",
          }}>Select an actor to view details</div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   SCHEMA / API REFERENCE PAGE
══════════════════════════════════════════════ */
const SchemaPage = () => {
  const [tab, setTab] = useState("schema");

  const codeStyle = {
    fontFamily:"'Courier New',monospace", fontSize:11, color:"#9A8A50",
    background:"#080604", border:"1px solid #1A1408", borderRadius:3,
    padding:"14px 16px", overflowX:"auto", lineHeight:1.7,
    whiteSpace:"pre",
  };

  const sqlSchema = `-- GENRES
CREATE TABLE genres (
  id     SERIAL PRIMARY KEY,
  name   VARCHAR(50) NOT NULL UNIQUE
);

-- MOVIES
CREATE TABLE movies (
  id             SERIAL PRIMARY KEY,
  title          VARCHAR(255) NOT NULL,
  release_year   SMALLINT NOT NULL,
  runtime_min    SMALLINT,
  synopsis       TEXT,
  director       VARCHAR(255),
  genre_id       INT REFERENCES genres(id),
  avg_rating     NUMERIC(3,1) DEFAULT 0,  -- denormalised cache
  rating_count   INT          DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT chk_year CHECK (release_year BETWEEN 1888 AND 2100)
);
CREATE INDEX idx_movies_avg_rating ON movies(avg_rating DESC);
CREATE INDEX idx_movies_genre      ON movies(genre_id);

-- ACTORS
CREATE TABLE actors (
  id            SERIAL PRIMARY KEY,
  full_name     VARCHAR(255) NOT NULL,
  birth_year    SMALLINT,
  nationality   VARCHAR(100),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- MOVIE_ACTORS  (join table)
CREATE TABLE movie_actors (
  movie_id  INT REFERENCES movies(id) ON DELETE CASCADE,
  actor_id  INT REFERENCES actors(id) ON DELETE CASCADE,
  role_name VARCHAR(255),
  PRIMARY KEY (movie_id, actor_id)
);
CREATE INDEX idx_ma_actor ON movie_actors(actor_id);

-- USERS
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(80)  NOT NULL UNIQUE,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- RATINGS
CREATE TABLE ratings (
  id         SERIAL PRIMARY KEY,
  movie_id   INT     REFERENCES movies(id) ON DELETE CASCADE,
  user_id    INT     REFERENCES users(id)  ON DELETE CASCADE,
  score      SMALLINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (movie_id, user_id),           -- one rating per user/movie
  CONSTRAINT chk_score CHECK (score BETWEEN 1 AND 10)
);
CREATE INDEX idx_ratings_movie ON ratings(movie_id);`;

  const prismaSchema = `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Movie {
  id          Int      @id @default(autoincrement())
  title       String
  releaseYear Int
  runtimeMin  Int?
  synopsis    String?
  director    String?
  avgRating   Decimal  @default(0)   @db.Decimal(3,1)
  ratingCount Int      @default(0)
  genre       Genre?   @relation(fields:[genreId], references:[id])
  genreId     Int?
  cast        MovieActor[]
  ratings     Rating[]
  createdAt   DateTime @default(now())
  @@index([avgRating(sort: Desc)])
}

model Actor {
  id          Int          @id @default(autoincrement())
  fullName    String
  birthYear   Int?
  nationality String?
  movies      MovieActor[]
  createdAt   DateTime     @default(now())
}

model MovieActor {
  movie   Movie  @relation(fields:[movieId], references:[id])
  movieId Int
  actor   Actor  @relation(fields:[actorId], references:[id])
  actorId Int
  roleName String?
  @@id([movieId, actorId])
  @@index([actorId])
}

model User {
  id           Int      @id @default(autoincrement())
  username     String   @unique
  email        String   @unique
  passwordHash String
  ratings      Rating[]
  createdAt    DateTime @default(now())
}

model Rating {
  id        Int      @id @default(autoincrement())
  movie     Movie    @relation(fields:[movieId], references:[id])
  movieId   Int
  user      User     @relation(fields:[userId],  references:[id])
  userId    Int
  score     Int
  createdAt DateTime @default(now())
  @@unique([movieId, userId])
  @@index([movieId])
}

model Genre {
  id     Int     @id @default(autoincrement())
  name   String  @unique
  movies Movie[]
}`;

  const apiEndpoints = [
    ["GET",   "/api/movies",            "List movies — ?page&limit&genre&sort=rating&q=search"],
    ["POST",  "/api/movies",            "Create movie (auth required)"],
    ["GET",   "/api/movies/:id",        "Movie detail + avg rating + cast"],
    ["PUT",   "/api/movies/:id",        "Update movie (auth required)"],
    ["DELETE","/api/movies/:id",        "Delete movie (admin)"],
    ["GET",   "/api/movies/top",        "Top N movies by avg_rating"],
    ["GET",   "/api/actors",            "List actors — ?q=name"],
    ["POST",  "/api/actors",            "Create actor"],
    ["GET",   "/api/actors/:id",        "Actor detail + filmography"],
    ["POST",  "/api/movies/:id/actors", "Link actor to movie {actorId, roleName}"],
    ["POST",  "/api/movies/:id/ratings","Submit/update rating {score:1-10}"],
    ["GET",   "/api/movies/:id/ratings","Rating distribution for a movie"],
    ["POST",  "/api/auth/register",     "Register user"],
    ["POST",  "/api/auth/login",        "Login → JWT"],
    ["GET",   "/api/stats/genres",      "Genre distribution stats"],
    ["GET",   "/api/stats/timeline",    "Avg rating over time"],
  ];

  const ratingController = `// POST /api/movies/:id/ratings   (atomic upsert + recompute)
export const submitRating = async (req, res) => {
  const { id: movieId } = req.params;
  const { score } = req.body;          // validated: 1-10
  const userId = req.user.id;

  await prisma.$transaction(async tx => {
    await tx.rating.upsert({
      where:  { movieId_userId: { movieId, userId } },
      create: { movieId, userId, score },
      update: { score },
    });

    // Recompute aggregate in same transaction
    const { _avg, _count } = await tx.rating.aggregate({
      where: { movieId },
      _avg:   { score: true },
      _count: { score: true },
    });

    await tx.movie.update({
      where: { id: movieId },
      data: {
        avgRating:   _avg.score ?? 0,
        ratingCount: _count.score,
      },
    });
  });

  return res.status(200).json({ success: true });
};`;

  return (
    <div style={{overflowY:"auto",height:"100%",padding:"24px 20px"}}>
      <div style={{display:"flex",gap:8,marginBottom:24}}>
        {["schema","prisma","api","rating"].map(t => (
          <button key={t} onClick={()=>setTab(t)}
            style={{
              padding:"6px 16px", border:"1px solid",
              borderColor: tab===t ? "#C9A84C" : "#2A2010",
              background: tab===t ? "#C9A84C" : "transparent",
              color: tab===t ? "#0D0A04" : "#6A5A30",
              borderRadius:2, cursor:"pointer",
              fontFamily:"'Courier New',monospace", fontSize:10, letterSpacing:2,
              textTransform:"uppercase", fontWeight:700, transition:"all 0.2s",
            }}>{t}</button>
        ))}
      </div>

      {tab==="schema" && (
        <>
          <div style={{fontFamily:"'Courier New',monospace",fontSize:10,color:"#6A5A30",letterSpacing:2,marginBottom:12}}>SQL SCHEMA — PostgreSQL</div>
          <div style={codeStyle}>{sqlSchema}</div>
        </>
      )}
      {tab==="prisma" && (
        <>
          <div style={{fontFamily:"'Courier New',monospace",fontSize:10,color:"#6A5A30",letterSpacing:2,marginBottom:12}}>PRISMA SCHEMA</div>
          <div style={codeStyle}>{prismaSchema}</div>
        </>
      )}
      {tab==="api" && (
        <>
          <div style={{fontFamily:"'Courier New',monospace",fontSize:10,color:"#6A5A30",letterSpacing:2,marginBottom:12}}>REST API ENDPOINTS</div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'Courier New',monospace",fontSize:11}}>
              <thead>
                <tr style={{borderBottom:"1px solid #2A2010"}}>
                  {["Method","Path","Description"].map(h => (
                    <th key={h} style={{textAlign:"left",padding:"8px 12px",color:"#6A5A30",fontWeight:700,letterSpacing:1,fontSize:10}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {apiEndpoints.map(([m,p,d],i) => (
                  <tr key={i} style={{borderBottom:"1px solid #1A1008"}}>
                    <td style={{padding:"7px 12px",color:m==="GET"?"#7AA070":m==="POST"?"#C9A84C":m==="PUT"?"#7080A0":"#A07070",fontWeight:700}}>{m}</td>
                    <td style={{padding:"7px 12px",color:"#9A8A50"}}>{p}</td>
                    <td style={{padding:"7px 12px",color:"#4A4020"}}>{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {tab==="rating" && (
        <>
          <div style={{fontFamily:"'Courier New',monospace",fontSize:10,color:"#6A5A30",letterSpacing:2,marginBottom:12}}>RATING CONTROLLER — atomic upsert + recompute</div>
          <div style={codeStyle}>{ratingController}</div>
          <div style={{marginTop:16,fontFamily:"'Courier New',monospace",fontSize:10,color:"#6A5A30",letterSpacing:2,marginBottom:8}}>CURL EXAMPLES</div>
          <div style={{...codeStyle,color:"#7A9A60"}}>
{`# Create a movie
curl -X POST /api/movies \\
  -H "Authorization: Bearer $JWT" \\
  -d '{"title":"Dune","releaseYear":2021,"genreId":3}'

# Submit rating
curl -X POST /api/movies/1/ratings \\
  -H "Authorization: Bearer $JWT" \\
  -d '{"score":9}'

# Top 5 movies
curl "/api/movies/top?limit=5"

# Search + filter
curl "/api/movies?genre=Drama&sort=rating&q=shaw&page=1&limit=10"`}
          </div>
        </>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("movies");
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [userRatings, setUserRatings] = useState({});
  const [movies, setMovies] = useState(MOVIES);

  // Font injection
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const handleRate = useCallback((movieId, score) => {
    setUserRatings(prev => ({ ...prev, [movieId]: score }));
    setMovies(prev => prev.map(m => {
      if (m.id !== movieId) return m;
      const newCount = m.votes + (prev[movieId] ? 0 : 1);
      const newRating = parseFloat(((m.rating * m.votes + score) / newCount).toFixed(1));
      return { ...m, rating: newRating, votes: newCount };
    }));
  }, []);

  const genres = ["All", ...Array.from(new Set(MOVIES.map(m=>m.genre))).sort()];

  const filtered = movies
    .filter(m => genreFilter === "All" || m.genre === genreFilter)
    .filter(m => !search || m.title.toLowerCase().includes(search.toLowerCase()) || m.director.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => sortBy==="rating" ? b.rating-a.rating : sortBy==="year" ? b.year-a.year : a.title.localeCompare(b.title));

  const navItems = [
    { id:"movies",  label:"Films" },
    { id:"actors",  label:"Cast" },
    { id:"charts",  label:"Analytics" },
    { id:"schema",  label:"Blueprint" },
  ];

  return (
    <div style={{
      fontFamily:"Georgia,serif",
      background:"#080604",
      color:"#C8B87A",
      minHeight:"100vh",
      display:"flex",
      flexDirection:"column",
      // Film grain overlay via CSS
    }}>
      {/* NOISE TEXTURE */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap');
        * { box-sizing: border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:#080604; }
        ::-webkit-scrollbar-thumb { background:#2A2010; border-radius:2px; }
        ::-webkit-scrollbar-thumb:hover { background:#C9A84C44; }
        body { background:#080604; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .fade-in { animation: fadeIn 0.4s ease forwards; }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{
        borderBottom:"1px solid #1A1408",
        background:"linear-gradient(180deg,#0D0A04,#080604)",
        padding:"0 24px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        height:56, flexShrink:0,
        position:"sticky", top:0, zIndex:100,
      }}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{
            fontFamily:"'Playfair Display',serif", fontWeight:900, fontSize:20,
            color:"#C9A84C", letterSpacing:2, textTransform:"uppercase",
            textShadow:"0 0 30px #C9A84C44",
          }}>
            ◆ Cinémathèque
          </div>
          <div style={{width:1,height:20,background:"#2A2010"}}/>
          <nav style={{display:"flex",gap:4}}>
            {navItems.map(n => (
              <button key={n.id} onClick={()=>{setPage(n.id);setSelectedMovie(null);}}
                style={{
                  padding:"6px 14px", background:"none",
                  border:"none", cursor:"pointer",
                  fontFamily:"'Courier New',monospace", fontSize:11, letterSpacing:1.5,
                  textTransform:"uppercase",
                  color: page===n.id ? "#C9A84C" : "#4A3A18",
                  borderBottom: page===n.id ? "1px solid #C9A84C" : "1px solid transparent",
                  transition:"color 0.2s",
                }}
              >{n.label}</button>
            ))}
          </nav>
        </div>
        <div style={{fontFamily:"'Courier New',monospace",fontSize:10,color:"#2A2010",letterSpacing:2}}>
          {movies.length} FILMS · {ACTORS.length} ACTORS
        </div>
      </header>

      {/* ── BODY ── */}
      <div style={{flex:1, overflow:"hidden", display:"flex", flexDirection:"column"}}>

        {/* ─ MOVIES PAGE ─ */}
        {page==="movies" && (
          <div style={{display:"grid",gridTemplateColumns:"340px 1fr",flex:1,overflow:"hidden"}}>

            {/* Left: list + filters */}
            <div style={{borderRight:"1px solid #1A1408",display:"flex",flexDirection:"column",overflow:"hidden"}}>
              {/* Search */}
              <div style={{padding:"12px 14px",borderBottom:"1px solid #1A1408",flexShrink:0}}>
                <input
                  value={search} onChange={e=>setSearch(e.target.value)}
                  placeholder="Search title or director…"
                  style={{
                    width:"100%", background:"#0D0A04", border:"1px solid #2A2010",
                    color:"#C8B87A", padding:"8px 12px", borderRadius:3,
                    fontFamily:"'Courier New',monospace", fontSize:11, outline:"none",
                  }}
                />
              </div>
              {/* Filters */}
              <div style={{
                padding:"8px 14px", borderBottom:"1px solid #1A1408",
                display:"flex",gap:6,flexWrap:"wrap",flexShrink:0,
              }}>
                {genres.map(g => (
                  <button key={g} onClick={()=>setGenreFilter(g)}
                    style={{
                      padding:"3px 10px", borderRadius:2, cursor:"pointer",
                      background: genreFilter===g ? "#C9A84C" : "transparent",
                      border:`1px solid ${genreFilter===g ? "#C9A84C" : "#2A2010"}`,
                      color: genreFilter===g ? "#0D0A04" : "#4A3A18",
                      fontFamily:"'Courier New',monospace", fontSize:9, letterSpacing:1,
                      textTransform:"uppercase", transition:"all 0.15s",
                    }}>{g}</button>
                ))}
              </div>
              {/* Sort */}
              <div style={{
                padding:"6px 14px", borderBottom:"1px solid #1A1408",
                display:"flex",gap:8,alignItems:"center",flexShrink:0,
              }}>
                <span style={{fontFamily:"'Courier New',monospace",fontSize:9,color:"#3A2E10",letterSpacing:1}}>SORT</span>
                {["rating","year","title"].map(s => (
                  <button key={s} onClick={()=>setSortBy(s)}
                    style={{
                      padding:"2px 8px", border:"none", background:"none", cursor:"pointer",
                      fontFamily:"'Courier New',monospace", fontSize:9, letterSpacing:1,
                      color: sortBy===s ? "#C9A84C" : "#3A2E10",
                      textTransform:"uppercase", textDecoration: sortBy===s ? "underline" : "none",
                    }}>{s}</button>
                ))}
                <span style={{marginLeft:"auto",fontFamily:"'Courier New',monospace",fontSize:9,color:"#2A2010"}}>
                  {filtered.length} results
                </span>
              </div>
              {/* Movie list */}
              <div style={{overflowY:"auto",flex:1,padding:"10px 12px",display:"flex",flexDirection:"column",gap:6}}>
                {filtered.map(m => (
                  <div key={m.id} className="fade-in">
                    <MovieCard
                      movie={m}
                      onClick={setSelectedMovie}
                      selected={selectedMovie?.id === m.id}
                    />
                  </div>
                ))}
                {filtered.length===0 && (
                  <div style={{textAlign:"center",padding:"40px 0",fontFamily:"'Playfair Display',serif",fontSize:14,color:"#2A2010",fontStyle:"italic"}}>
                    No films match your search.
                  </div>
                )}
              </div>
            </div>

            {/* Right: detail */}
            <div style={{overflow:"hidden"}}>
              {selectedMovie ? (
                <div className="fade-in" style={{height:"100%"}}>
                  <MovieDetail
                    movie={selectedMovie}
                    actors={ACTORS}
                    onRate={handleRate}
                    userRatings={userRatings}
                  />
                </div>
              ) : (
                <div style={{
                  height:"100%",display:"flex",flexDirection:"column",
                  alignItems:"center",justifyContent:"center",gap:12,
                }}>
                  <div style={{
                    fontSize:64, opacity:0.06, userSelect:"none",
                    fontFamily:"'Playfair Display',serif",
                  }}>◆</div>
                  <div style={{
                    fontFamily:"'Playfair Display',serif",fontSize:16,
                    color:"#2A2010",fontStyle:"italic",
                  }}>Select a film to view details</div>
                </div>
              )}
            </div>
          </div>
        )}

        {page==="actors" && (
          <div className="fade-in" style={{flex:1,overflow:"hidden"}}>
            <ActorsPage actors={ACTORS} movies={movies}/>
          </div>
        )}

        {page==="charts" && (
          <div className="fade-in" style={{flex:1,overflow:"hidden"}}>
            <ChartsPage movies={movies}/>
          </div>
        )}

        {page==="schema" && (
          <div className="fade-in" style={{flex:1,overflow:"hidden"}}>
            <SchemaPage/>
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop:"1px solid #1A1408", padding:"8px 24px",
        display:"flex", justifyContent:"space-between", alignItems:"center",
        flexShrink:0,
      }}>
        <div style={{fontFamily:"'Courier New',monospace",fontSize:9,color:"#2A2010",letterSpacing:2}}>
          CINÉMATHÈQUE · Node + Prisma + PostgreSQL + React + Recharts
        </div>
        <div style={{fontFamily:"'Courier New',monospace",fontSize:9,color:"#2A2010",letterSpacing:1}}>
          {Object.keys(userRatings).length} films rated this session
        </div>
      </footer>
    </div>
  );
}