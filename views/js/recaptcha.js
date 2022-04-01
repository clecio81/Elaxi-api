
    if (grecaptcha.getResponse() == "success") {
        window.location.href = "https://www.youtube.com/";

        setTimeout(Redirect, 1000);
    } else alert("You can't proceed!");