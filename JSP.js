const APP_ID = '98a84bad74bb4de0b0728bf1730007ab';
const CHANNEL_NAME = 'test';
const TOKEN = '007eJxTYHhydNa98NxbzS33tdf7NazbxPPk8axZ5bflQ2/OqTTq+vJZgcHSItHCJCkxxdwkKckkJdUgycDcyCIpzdDc2MDAwDwxqVb2W3pDICOD3f8LjIwMEAjiszCUpBaXMDAAAIEiI54='
   
let video = document.getElementById("localvideo");

if (!video) {
    console.error("L'élément vidéo avec l'ID 'localvideo' est introuvable.");
} else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    async function startAgora() {
        try {
            // Joindre le canal
            await client.join(APP_ID, CHANNEL_NAME, TOKEN, null);

            // Créer une piste vidéo pour la caméra arrière
            const [videoTrack] = await AgoraRTC.createCameraVideoTrack({
                facingMode: "environment",
            });

            // Afficher le flux vidéo local
            video.srcObject = videoTrack.getMediaStreamTrack().stream;
            video.play();

            // Publier la piste vidéo
            await client.publish([videoTrack]);

            console.log("Flux vidéo publié avec succès dans le canal :", CHANNEL_NAME);
        } catch (error) {
            console.error("Erreur lors de la publication du flux vidéo :", error);
        }
    }

    startAgora();
} else {
    console.error("L'API getUserMedia n'est pas prise en charge par ce navigateur.");
}