function startScanner(){

const html5QrCode = new Html5Qrcode("reader");

html5QrCode.start(

{ facingMode: "environment" },

{

fps:10,
qrbox:250

},

(code)=>{

document.getElementById("mesin").value=code

html5QrCode.stop()

}

).catch(err=>{

alert("kamera tidak tersedia")

})

}