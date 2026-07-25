document.head.insertAdjacentHTML("beforeend", `
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../CSS/globalStyle.css">
`);

const tailwindScript = document.createElement("script");
tailwindScript.src = "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4";
document.head.appendChild(tailwindScript);
