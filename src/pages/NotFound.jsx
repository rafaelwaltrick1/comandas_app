import { Box, Typography, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                p: 3
            }}
        >
            <Typography variant="h1" fontWeight={700}>
                404
            </Typography>

            <Typography variant="h5">
                Página não encontrada
            </Typography>

            <TextField
                placeholder="Rafael Waltrick"
            />

            <Button variant="contained" onClick={() => navigate("/home")}>
                Voltar para Home
            </Button>
        </Box>
    );
};

export default NotFound;