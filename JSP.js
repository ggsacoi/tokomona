const APP_ID = '98a84bad74bb4de0b0728bf1730007ab';
const CHANNEL_NAME = 'name';
const TOKEN = '007eJxTYHD6vZJtE49V7+l92zfkHj6ep5geUjHxwq/2+993+ci9UClWYLC0SLQwSUpMMTdJSjJJSTVIMjA3skhKMzQ3NjAwME9MOmL5M70hkJHBdMpqJkYGCATxWRjyEnNTGRgA88chtw==';

let video = document.getElementById("localvideo");
let startButton = document.getElementById("envoi");

if (!video) {
    console.error("L'élément vidéo avec l'ID 'localvideo' est introuvable.");
} else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8", disableStats: true });

    async function startAgora() {
        try {
            console.log("Tentative de rejoindre le canal...");
            await client.join(APP_ID, CHANNEL_NAME, TOKEN, null);
            console.log("Rejoint avec succès !");
        } catch (error) {
            console.error("Erreur lors de la tentative de rejoindre le canal :", error);
            alert("Impossible de rejoindre le canal. Vérifiez votre connexion.");
            return;
        }
    
        let videoTrack;
        try {
            console.log("Création de la piste vidéo...");
            videoTrack = await AgoraRTC.createCameraVideoTrack({
                facingMode: "environment",
                encoderConfig: "360p",
            });
            console.log("Piste vidéo créée avec succès !");
        } catch (error) {
            console.error("Erreur lors de la création de la piste vidéo :", error);
            alert("Impossible d'accéder à la caméra. Vérifiez les permissions.");
            return;
        }
    
        try {
            console.log("Affichage du flux vidéo local...");
            video.srcObject = videoTrack.getMediaStream();
            await video.play();
            console.log("Flux vidéo affiché avec succès !");
        } catch (error) {
            console.error("Erreur lors de l'affichage du flux vidéo :", error);
            alert("Impossible d'afficher le flux vidéo.");
            return;
        }
    
        try {
            console.log("Tentative de publication du flux...");
            await client.publish([videoTrack]);
            console.log("Flux vidéo publié avec succès !");
        } catch (error) {
            console.error("Erreur lors de la publication du flux vidéo :", error);
            alert("Impossible de publier le flux vidéo.");
        }
    }

    startButton.addEventListener("click", () => {
        console.log("Bouton cliqué, démarrage de la vidéo...");
        startAgora();
    });
} else {
    console.error("L'API getUserMedia n'est pas prise en charge par ce navigateur.");
}