const APP_ID = '98a84bad74bb4de0b0728bf1730007ab';
const CHANNEL_NAME = 'test';
const TOKEN = '007eJxTYHhydNa98NxbzS33tdf7NazbxPPk8axZ5bflQ2/OqTTq+vJZgcHSItHCJCkxxdwkKckkJdUgycDcyCIpzdDc2MDAwDwxqVb2W3pDICOD3f8LjIwMEAjiszCUpBaXMDAAAIEiI54=';

let video = document.getElementById("localvideo");
let startButton = document.getElementById("envoi");

if (!video) {
    console.error("L'élément vidéo avec l'ID 'localvideo' est introuvable.");
} else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8", disableStats: true });

    async function startAgora() {
        try {
            // Joindre le canal
            console.log("Tentative de rejoindre le canal...");
            await client.join(APP_ID, CHANNEL_NAME, TOKEN, null);
            console.log("Rejoint avec succès !");

            // Créer une piste vidéo pour la caméra arrière
            const [videoTrack] = await AgoraRTC.createCameraVideoTrack({
                facingMode: "environment", encoderConfig: "360p",
            }).catch((error) => {
                console.error("Erreur lors de la création de la piste vidéo :", error);
                return null;
            });

            if (!videoTrack) {
                console.error("Impossible de créer une piste vidéo. Vérifiez les permissions de la caméra.");
                return;
            }

            // Afficher le flux vidéo local dans l'élément <video>
            console.log("Affichage du flux vidéo local...");
            video.srcObject = videoTrack.getMediaStream(); // Associer le flux vidéo à l'élément <video>
            await video.play(); // Démarrer la lecture du flux vidéo
            console.log("Flux vidéo affiché avec succès !");

            // Publier le flux vidéo sur Agora
            console.log("Tentative de publication du flux...");
            await client.publish([videoTrack]);
            console.log("Flux vidéo publié avec succès !");
        } catch (error) {
            console.error("Erreur lors de la configuration Agora :", error);
            alert("Problème de connexion. Veuillez vérifier votre réseau et réessayer.");
        }

        // Gestion des événements
        client.on("stream-removed", (evt) => {
            console.log("Flux supprimé :", evt.uid);
        });

        client.on("user-unpublished", (user, mediaType) => {
            console.log("Utilisateur non publié :", user.uid, "Type :", mediaType);
        });
    }

    startButton.addEventListener("click", () => {
        console.log("Bouton cliqué, démarrage de la vidéo...");
        startAgora();
    });
} else {
    console.error("L'API getUserMedia n'est pas prise en charge par ce navigateur.");
}