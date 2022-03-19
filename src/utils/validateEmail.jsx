export default function validateEmail(email) {
    let validated = String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-ZÄäÖöÜü\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );

    if (validated == null) {
        return false;
    } else {
        return true;
    }
}