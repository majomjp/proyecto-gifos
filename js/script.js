//cambio de theme

document.getElementById("btn-night").addEventListener("click", ()=>{
   if(document.getElementById("body").className == "body"){
       document.getElementById("body").classList.toggle("dark");
       document.getElementById("logo").setAttribute("src", "assets/gifOF_logo_dark.png");
       document.getElementById("lens").setAttribute("src", "assets/Combined Shape.svg");
       document.getElementById("forward").setAttribute("src","assets/forward.svg");
       }
   });
document.getElementById("btn-day").addEventListener("click", ()=>{
   if(document.getElementById("body").className !== "body"){
       document.getElementById("body").classList.toggle("dark");
       document.getElementById("logo").setAttribute("src", "assets/gifOF_logo.png")
       document.getElementById("lens").setAttribute("src", "assets/lupa_inactive.svg")
       document.getElementById("forward").setAttribute("src","assets/dropdown.svg")    
   }
});

    // Numero RANDOM de visitas
    function random(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
  }

  function randomNum() {
      let aleatorio = Math.round(Math.random() * 999)
      return aleatorio
  }
  let visitas = document.querySelector("#numero")
  visitas.innerHTML = random(1, 13) + "," + randomNum() + "," + randomNum()

  //busqueda

  const token = "si6zNqnye7FeDT8K3fiA0XeFWDtsJ0PF";
  const searchParam = document.getElementById("qsearch").value;
  const input = document.getElementById("qsearch");
  const hashtag = new Set();

async function buscar () {
   const qsearch = document.getElementById("qsearch").value;
    const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${token}&q=${qsearch}&limit=20&offset=0&rating=G&lang=en`);
    const res = await response.json();
    console.log(res);
    return res 
    
    }

    document.getElementById('btn-search').addEventListener('click', (e) => { 
       e.preventDefault();
       buscar().then(resolve => {
          console.log(resolve);
          const cont = document.getElementById('results');
          cont.innerHTML= "";

          resolve.data.forEach(gif => {
             const imgn = document.createElement('img')
             imgn.src = gif.images.fixed_height.url;
             document.getElementById('results').appendChild(imgn);
          });
       })
    })

    function hashtagBtn(){
      const lastSearching = document.createElement("button");
      const searchcont = document.getElementById("searchcont");
      const text = document.createElement ("p");
      lastSearching.className = "hashtag";
      searchcont.appendChild(lastSearching);
      lastSearching.appendChild(text);
      for (const item of hashtag){
          text.innerHTML = `# ${item}`;
          var q = item;
      };
   }

    input.addEventListener("keyup",suggestSearch);

const optionOne = document.getElementById("suggestSearch-option1")
const optionTwo = document.getElementById("suggestSearch-option2")
const optionThree = document.getElementById("suggestSearch-option3")
function suggestSearch(){
    const searchingParams = document.getElementById("qsearch").value;
    document.getElementById("suggestSearch").className = "suggestSearch";
    optionOne.innerHTML = `${searchingParams} run`;
    optionTwo.innerHTML = `${searchingParams} big`;
    optionThree.innerHTML = `${searchingParams} happy`; 
    if (searchingParams == "") {
        document.getElementById("suggestSearch").className = "hidden";}
}
optionOne.addEventListener("click",()=>{
    document.getElementById("suggestSearch").className = "hidden";
    let q = optionOne.innerHTML;
    searchOptions(q)
})
optionTwo.addEventListener("click",()=>{
    document.getElementById("suggestSearch").className = "hidden";
    let q = optionTwo.innerHTML;
    searchOptions(q)
})
optionThree.addEventListener("click",()=>{
    document.getElementById("suggestSearch").className = "hidden";
    let q = optionThree.innerHTML;
    searchOptions(q)
})



async function searchOptions(input){       
   document.getElementById("results").innerHTML=""; 
   const url = "https://api.giphy.com/v1/gifs/search?q="+input+"&api_key="+token+"&limit=20";
   const resp = await fetch (url);
   const datos = await resp.json();
   console.log(datos);
   const title = document.getElementById("result_title");
   result.className = "sections"; 
   title.innerHTML = input;
   hashtag.add(input);
   searched.push(input);
   localStorage.setItem("busquedas", JSON.stringify(searched))  
   hashtagBtn()
   datos.data.forEach(gif => {
       const divResult = document.getElementById("results");
       const div = document.createElement("div");
       const img = document.createElement("img");  
       img.src = gif.images.fixed_height.url;
       divResult.appendChild(div);
       div.appendChild(img);

   }); 
   return datos; 
}



    //Hoy te sugerimos

    const searched = [];

    async function sugGifs(){
      const url = `https://api.giphy.com/v1/gifs/search?q=coding&api_key=${token}&limit=4`;
      const resp = await fetch (url);
      const datos= await resp.json();
      const title = datos.data.title
      console.log(datos);
      datos.data.forEach(gif => {
         const suggestions = document.getElementById('suggestions-ok');
         const eachGif = document.createElement("div");
         const img = document.createElement("img");
         const titleHash = document.createElement("div");
         const verMas = document.createElement("button");
         const title = gif.title;
         eachGif.className = "gif-sug";
         titleHash.className = "titlehashtag";
         verMas.className = "vermas";
         img.src = gif.images.fixed_height.url;
         titleHash.innerHTML=`# ${title}`;
         verMas.innerHTML= "Ver Mas";
         suggestions.appendChild(eachGif);
         eachGif.appendChild(img);
         eachGif.appendChild(titleHash);
         eachGif.appendChild(verMas);
         verMas.addEventListener('click', async(e)=>{
            e.preventDefault();
            suggestions.innerHTML="";
            const url = `https://api.giphy.com/v1/gifs/search?q=coding&api_key=${token}&limit=10`;
            const resp = await fetch (url);
            const datos = await resp.json();
            console.log(datos);
            datos.data.forEach(gif => {
               const divResult = document.getElementById('suggestions-ok');
               const div = document.createElement("div");
               const img = document.createElement("img");  
               img.src = gif.images.fixed_height.url;
               divResult.appendChild(div);
               div.appendChild(img);
           })

         })
      });
     return datos
    }
    sugGifs()


    
    //tendencias

    async function trendingGifs(){
      const url = `https://api.giphy.com/v1/gifs/trending?api_key=${token}&limit=10`;
      const resp = await fetch (url);
      const datos = await resp.json();
      console.log(datos);
      datos.data.forEach(gif => {
          const trendsOk = document.getElementById("trends-ok");
          const div = document.createElement("div");
          const img = document.createElement("img");
          img.src = gif.images.fixed_height.url;
          div.className = "trendgif";
          const downHover = document.createElement("div");
          downHover.className = "downhover";
          downHover.innerHTML = `# ${gif.title}`
          trendsOk.appendChild(div);
          div.appendChild(img);
          div.appendChild(downHover)
  
      });
      return datos;
   }
   trendingGifs();

   document.getElementById("mygifs").addEventListener("click", getMyGifos);

   const result = document.getElementById("busqueda-gif");

async function getMyGifos(){
    const gifs = localStorage.getItem('arrayMyGifs');
    const gifResult = document.getElementById('results');
    result.className = "sections";
    gifResult.innerHTML= "";
    const url = `https://api.giphy.com/v1/gifs?apiKey=${token}&ids=${gifs}`;
    const resp = await fetch (url);
    const datos= await resp.json();
    console.log(datos);
    datos.data.forEach(gif => {
        const eachGif = document.createElement("div");
        const img = document.createElement("img");
        img.src = gif.images.fixed_height.url;
        gifResult.appendChild(eachGif);
        eachGif.appendChild(img);
        });
    };




