const video = document.getElementById("video");
const img = document.getElementById("gifBlock");
const stopBtn = document.getElementById("btnStop");
const btnCapture = document.getElementById("btnCapture");
const btnImg = document.getElementById("btnImg");
const btnGifCaptured = document.getElementById("btnGifCaptured");
const uploadURL = "https://upload.giphy.com/v1/gifs?api_key=si6zNqnye7FeDT8K3fiA0XeFWDtsJ0PF";
const cancel = document.getElementById("cancel");
const topUpload = document.getElementById("top_upload");
let arrayMyGIfs = [];
const gifsResults = document.getElementById("mygifos_result");
const apiKey = "si6zNqnye7FeDT8K3fiA0XeFWDtsJ0PF";
let urlGif = "";
let blob = null;

document.getElementById("start").addEventListener("click", starting)
async function getMyGifs(){
  const gifs = localStorage.getItem('arrayMyGifs');
  const url = `https://api.giphy.com/v1/gifs?apiKey=${apiKey}&ids=${gifs}`;
  const resp = await fetch (url);
  const datos= await resp.json();
  console.log(datos);
  datos.data.forEach(gif => {
    const eachGif = document.createElement("div");
    const img = document.createElement("img");
    img.src = gif.images.fixed_height.url;
    gifsResults.appendChild(eachGif);
    eachGif.appendChild(img);
})
}

getMyGifs(gifsResults);

function starting(){ 
    document.getElementById("create").className = "hide";
    document.getElementById("misGifos").className = "hide";
    document.getElementById("videoScreen").className = "show_upload";
    getStream()
}

function getStream() {
    navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                height: 434,
                width: 844,
            }
        })
        .then(function(camera) {
            video.srcObject = camera;
            video.play()
        })
};

btnCapture.addEventListener("click",async () => {

    let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    document.querySelector("#btnImg img").src = "assets/recording.svg";
    btnImg.className = "btnImgStop";
    btnCapture.className ="hide";
    stopBtn.className = "btnstop";
    topUpload.innerHTML="Capturando tu gifo";
    document.getElementById("time").className = "time";
    recordGif(stream)
});

function recordGif(stream) {
    recorder = new RecordRTCPromisesHandler(stream, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        hidden: 240,
        onGifRecordingStarted: function() {
            console.log('Recording started')
        },
    });
    recorder.startRecording();
}
stopBtn.addEventListener("click", stopRecord);

async function stopRecord(){
    await recorder.stopRecording();
    blob = await recorder.getBlob();
    urlGif = URL.createObjectURL(blob);
    video.style.display = "none"
    img.src = urlGif
    img.style.display = "block";
    const form = new FormData ();
    form.append("file", blob, "myGif.gif");
    console.log(form.get("file"));
    btnGifCaptured.className = "btnGifCaptured";
    stopBtn.className = "hide";
    btnImg.className = "hide"; 
    document.querySelector("#btnImg img").src = "";
    topUpload.innerHTML="Vista previa";
};
function repeatAll(){
    img.src= "";
    img.style.display = "none";
    video.style.display ="block";
    btnCapture.className = "upload-btn";
    btnGifCaptured.className = "hide";
    btnImg.style.display ="block";
    btnImg.className = "btnImgCapture";
    document.getElementById("time").className = "time-hide";    
    document.querySelector("#btnImg img").src = "assets/camera.svg";
    topUpload.innerHTML="Crear Guifos";
    cancel.className = "hide";
    document.getElementById("uploading").className="hide";
    getStream();
}

document.getElementById("repeatGif").addEventListener("click", repeatAll);
const saveMyGifs = (gifID) => {
    if (localStorage.getItem('arrayMyGifs') == null) {
      arrayMyGIfs.push(gifID);
    } else {
      arrayMyGIfs = localStorage.getItem('arrayMyGifs').split(',');
      arrayMyGIfs.push(gifID);
    }
    localStorage.setItem('arrayMyGifs', arrayMyGIfs.join());
  };

document.getElementById("uploadGif").addEventListener("click", () => {
    topUpload.innerHTML="Subiendo Gifo";
    cancel.className = "repeat";
    document.getElementById("time").className = "time-hide";
    btnGifCaptured.className = "hide";
    img.style.display = "none";
    document.getElementById("uploading").className="uploading";
    const formData = new FormData();
    formData.append('file', blob, 'myGif.gif');
    console.log(formData.get('file'))
    const xhr = new XMLHttpRequest();
    xhr.open('POST', uploadURL, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        const gifObject = JSON.parse(xhr.response);
        saveMyGifs(gifObject.data.id);
        getMyGifs(gifsResults);
        document.getElementById("uploadOk").className = "uploadOk";
        document.getElementById("misGifos").className = "mygifos";
        document.getElementById("videoScreen").className = "hide";
        document.getElementById("yourGifo").src = urlGif;
      }
    }
    try {
      xhr.send(formData);
    } catch (e) {
      alert('Error al enviar el gif:' + e);
    }
  });

cancel.addEventListener("click",repeatAll);
function copyToClipboard(text){
  const hiddentextarea = document.createElement('textarea');
  document.body.appendChild(hiddentextarea);
  hiddentextarea.value = text;
  hiddentextarea.select();
  document.execCommand('copy');
  document.body.removeChild(hiddentextarea);
};
document.getElementById("copy").addEventListener("click",()=>{
  try {
    copyToClipboard(urlGif);
    alert('Enlace copiado con éxito!');
  } catch (e) {
    alert('Error al copiar el enlace');
  }
});
document.getElementById("download").addEventListener("click",()=>{
  invokeSaveAsDialog(blob);
})
document.getElementById("ready").addEventListener("click",()=>{
  document.getElementById("create").className = "create_gifos";
  document.getElementById("uploadOk").className = "hide";
})