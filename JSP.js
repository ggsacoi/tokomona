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
            console.log("Tentative de rejoindre le canal...");
            await client.join(APP_ID, CHANNEL_NAME, TOKEN, null);
            console.log("Rejoint avec succès !");

            // Créer une piste vidéo pour la caméra arrière
            const [videoTrack] = await AgoraRTC.createCameraVideoTrack({
                facingMode: "environment",
            }).catch((error) => {
                console.error("Erreur lors de la création de la piste vidéo :", error);
                return null;
            });
    
            if (!videoTrack) {
                console.error("Impossible de créer une piste vidéo. Vérifiez les permissions de la caméra.");
                return;
            }

            // Afficher le flux vidéo local
            video.srcObject = videoTrack.getMediaStreamTrack().stream;
            video.play();

            console.log("Tentative de publication du flux...");
            await client.publish([videoTrack]);
            console.log("Flux vidéo publié avec succès !");
        } catch (error) {
            console.error("Erreur lors de la configuration Agora :", error);
        }
    
        client.on("stream-removed", (evt) => {
            console.log("Flux supprimé :", evt.uid);
        });
    
        client.on("user-unpublished", (user, mediaType) => {
            console.log("Utilisateur non publié :", user.uid, "Type :", mediaType);
        });
    }
    startAgora();
} else {
    console.error("L'API getUserMedia n'est pas prise en charge par ce navigateur.");
}