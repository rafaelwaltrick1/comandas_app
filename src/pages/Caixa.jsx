import { TextField } from "@mui/material";
import PageLayout from "../components/common/PageLayout";

const Caixa = () => {
    return (
        <PageLayout title="Caixa">
            <TextField
                label="Digite seu nome"
                placeholder="Rafael Waltrick"
                fullWidth
            />
        </PageLayout>
    );
};

export default Caixa;