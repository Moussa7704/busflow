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

const bookingConfirmationTemplate = ({
    passengerName,
    compagnyName,
    departureCity,
    arrivalCity,
    departureTime,
    arrivalTime,
    tickets
}) => {

    const ticketsHtml = tickets.map(ticket => `
        <div style="border:1px solid #eee; border-radius:8px; padding:15px; margin:15px 0; text-align:center;">
            <p style="margin:0 0 5px; font-size:14px; color:#555;">
                Siège n° <strong>${ticket.seat_number}</strong> — Réf. <strong>${ticket.booking_reference}</strong>
            </p>
            <p style="margin:0 0 10px; font-size:13px; color:#999;">
                Billet ${ticket.ticket_number}
            </p>
            <img src="cid:${ticket.cid}" alt="QR Code" style="width:160px; height:160px;" />
        </div>
    `).join("");

    return `
    <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
        <div style="max-width:500px; margin:auto; background:#fff; padding:20px; border-radius:10px; text-align:center;">

            <h2 style="color:#333;">🎫 Réservation confirmée</h2>

            <p style="font-size:16px; color:#555;">
                Bonjour ${passengerName}, votre réservation avec <strong>${compagnyName}</strong> est confirmée.
            </p>

            <div style="background:#f0f0f0; border-radius:8px; padding:15px; margin:20px 0; text-align:left;">
                <p style="margin:4px 0;"><strong>Trajet :</strong> ${departureCity} → ${arrivalCity}</p>
                <p style="margin:4px 0;"><strong>Départ :</strong> ${departureTime}</p>
                <p style="margin:4px 0;"><strong>Arrivée :</strong> ${arrivalTime}</p>
            </div>

            <p style="font-size:14px; color:#555;">
                Présentez le(s) QR code(s) ci-dessous à l'embarquement :
            </p>

            ${ticketsHtml}

            <hr/>

            <p style="font-size:12px; color:#999;">
                Bon voyage avec ${compagnyName} !
            </p>

        </div>
    </div>
    `;
};

module.exports = {
    emailTemplate,
    resetTemplate,
    bookingConfirmationTemplate
}