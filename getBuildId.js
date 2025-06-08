// getBuildId.js
async function getBuildId() {
    try {
        const response = await fetch('https://securitytrails.com/app/account');
        const html = await response.text();
        const match = html.match(/"buildId":"(.*?)"/);
        if (match && match[1]) {
            return match[1];
        } else {
            console.error('❌ buildId not found');
            return null;
        }
    } catch (error) {
        console.error('❌ Failed to fetch buildId:', error);
        return null;
    }
}
 
