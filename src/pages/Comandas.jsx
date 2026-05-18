import { TextField } from "@mui/material";
import PageLayout from "../components/common/PageLayout";

const Comandas = () => {
    return (
        <PageLayout title="Comandas">
            <TextField
                label="Digite seu nome"
                placeholder="Rafael Waltrick"
                fullWidth
            />
        </PageLayout>
    );
};

export default Comandas;