// Perfil.jsx

import {
    Typography,
    Avatar,
    Box
} from "@mui/material";

import PageLayout from "../components/common/PageLayout";

import foto from "../assets/rafael.jpg";

const Perfil = () => {

    return (
        <PageLayout title="Perfil">

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2
                }}
            >

                <Avatar
                    src={foto}
                    sx={{
                        width: 180,
                        height: 180
                    }}
                />

                <Typography variant="h5">
                    Rafael Waltrick
                </Typography>

            </Box>

        </PageLayout>
    );
};

export default Perfil;