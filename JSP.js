const video = document.getElementById("localvideo");

if (!video) {
    console.error("L'élément vidéo avec l'ID 'localvideo' est introuvable.");
} else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            video.srcObject = stream;
            video.play(); // Assurez-vous que la vidéo démarre
        })
        .catch(function(error) {
            console.error("Erreur lors de l'accès à la caméra :", error);
        });
} else {
    console.error("L'API getUserMedia n'est pas prise en charge par ce navigateur.");
}