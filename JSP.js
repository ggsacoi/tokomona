document.addEventListener("DOMContentLoaded", () => {
    const APP_ID = '98a84bad74bb4de0b0728bf1730007ab'; 
    const CHANNEL_NAME = 'fini';
    const TOKEN = "007eJxTYCiv4vth8Dn6X1qM0ol6tjc1Zq8Stv3XaTi8xi6odZbyI0UFBkuLRAuTpMQUc5OkJJOUVIMkA3Mji6Q0Q3NjAwMD88SkIz9PpjcEMjJYyy1iZWSAQBCfhSEtMy+TgQEAmvwgkg==";
   

    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    let isConnected = false; // Variable pour suivre l'état de la connexion

    window.startStream = async function() {
        try {
            if (isConnected) {
                console.log("⚠️ Déjà connecté, pas besoin de rejoindre à nouveau.");
                return; // Empêche une nouvelle connexion
            }

            await client.join(APP_ID, CHANNEL_NAME, TOKEN, null);
            
            // Capture la caméra
            const localTrack = await AgoraRTC.createCameraVideoTrack();

            // Affiche la vidéo sur la page
            const videoElement = document.getElementById("localVideo");
            videoElement.srcObject = new MediaStream([localTrack.getMediaStreamTrack()]);

            // Envoie le flux vidéo à Agora
            await client.publish(localTrack);

            console.log("✅ Streaming en cours...");
        } catch (error) {
            console.error("❌ Erreur lors du streaming:", error);
        }
    }

let video = document.querySelector('localvideo');
if(navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
        video.srcObject = stream;

    })
    .catch(function(error) {
        console.log("Error: " + error);
    });
}
})