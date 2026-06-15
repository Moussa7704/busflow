const emailTemplate = (code) => `
<div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
            <div style="max-width:500px; margin:auto; background:#fff; padding:20px; border-radius:10px; text-align:center;">
                
                <h2 style="color:#333;">🔐 Vérification de votre compte</h2>

                <p style="font-size:16px; color:#555;">
                    Utilisez le code ci-dessous pour valider votre connexion :
                </p>

                <div style="font-size:28px; font-weight:bold; letter-spacing:5px; 
                            background:#f0f0f0; padding:15px; margin:20px 0; border-radius:8px;">
                    ${code}
                </div>

                <p style="color:red; font-size:14px;">
                    ⏳ Ce code expire dans 5 minutes
                </p>

                <hr/>

                <p style="font-size:12px; color:#999;">
                    Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
                </p>

            </div>
        </div>
`;

const resetTemplate = (link) => {
    return `
        <div style="font-family: Arial; text-align: center;">
            <h2>Réinitialiser le mot de passe</h2>
            
            <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>

            <a href="${link}" 
               style="display:inline-block; margin-top:15px; padding:10px 20px; 
                      background-color:#007bff; color:white; text-decoration:none; border-radius:5px;">
                Réinitialiser mon mot de passe
            </a>

            <p style="margin-top:20px; font-size:12px; color:gray;">
                Ce lien expire dans 1 heure.
            </p>
        </div>
    `;
};

module.exports = {
    emailTemplate,
    resetTemplate
}