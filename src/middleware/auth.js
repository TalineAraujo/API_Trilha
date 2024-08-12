const { verify } = require("jsonwebtoken");

async function auth(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            console.log("Token não fornecido!");
            return res.status(401).json({ message: "Token não fornecido!" });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            console.log("Formato de token inválido!");
            return res.status(401).json({ message: "Formato de token inválido!" });
        }

        const payload = verify(token, process.env.SECRET_JWT);
        console.log("Payload do token:", payload);

        req.payload = payload;
        next();
    } catch (error) {
        console.log("Erro ao verificar token:", error.message);
        return res.status(401).json({ message: "Token inválido!", cause: error.message });
    }
}

module.exports = { auth };


