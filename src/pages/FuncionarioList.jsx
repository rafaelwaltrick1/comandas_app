import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Card,
    CardContent,
    Typography,
    Box,
    Divider,
    Chip
} from "@mui/material";

import { FiberNew } from "@mui/icons-material";

import PageLayout from "../components/common/PageLayout";
import ActionButtons from "../components/common/ActionButtons";
import FuncionarioFilters from "../components/common/FuncionarioFilters";
import Pagination from "../components/common/Pagination";

import { funcionarioService } from "../services/funcionarioService";
import { useDialog } from "../hooks/useDialog";
import { useSnackbar } from "../hooks/useSnackbar";

const FuncionarioList = () => {
    const navigate = useNavigate();

    const { showConfirm } = useDialog();
    const { showSnackbar } = useSnackbar();

    const [funcionarios, setFuncionarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});
    const [pagination, setPagination] = useState({
        skip: 0,
        limit: 3,
        currentPage: 1,
    });
    const [hasItems, setHasItems] = useState(true);

    const formatCpf = (cpf) => {
        if (!cpf) return "";
        return cpf.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    };

    const formatTelefone = (telefone) => {
        if (!telefone) return "";
        return telefone.replace(/\D/g, "").replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    };

    const getGrupoInfo = (grupo) => {
        const grupos = {
            1: { label: "Administrador", color: "error" },
            2: { label: "Atendente", color: "primary" },
            3: { label: "Caixa", color: "success" },
        };

        return grupos[grupo] || { label: "Desconhecido", color: "default" };
    };

    const handleView = (funcionario) => {
        navigate(`/funcionario/view/${funcionario.id}`);
    };

    const handleEdit = (funcionario) => {
        navigate(`/funcionario/edit/${funcionario.id}`);
    };

    const handleDelete = (funcionario) => {
        showConfirm(
            "Excluir Funcionário",
            `Tem certeza que deseja excluir o funcionário "${funcionario.nome}"?`,
            async () => {
                try {
                    await funcionarioService.delete(funcionario.id);

                    showSnackbar("Funcionário excluído com sucesso!", "success");

                    const updatedFuncionarios = funcionarios.filter(
                        (f) => f.id !== funcionario.id
                    );

                    setFuncionarios(updatedFuncionarios);
                } catch (error) {
                    showSnackbar("Erro ao excluir funcionário", "error");
                }
            }
        );
    };

    const handleFilter = (newFilters) => {
        setFilters(newFilters);
        setPagination((prev) => ({
            ...prev,
            skip: 0,
            currentPage: 1,
        }));
    };

    const handleClearFilters = () => {
        setFilters({});
        setPagination((prev) => ({
            ...prev,
            skip: 0,
            currentPage: 1,
        }));
    };

    const handlePageChange = (newPage) => {
        const newSkip = (newPage - 1) * pagination.limit;

        setPagination((prev) => ({
            ...prev,
            skip: newSkip,
            currentPage: newPage,
        }));
    };

    const handleItemsPerPageChange = (newLimit) => {
        setPagination((prev) => ({
            ...prev,
            limit: newLimit,
            skip: 0,
            currentPage: 1,
        }));
    };

    const actions = (
        <Button
            variant="contained"
            startIcon={<FiberNew />}
            onClick={() => navigate("/funcionario")}
        >
            Novo
        </Button>
    );

    useEffect(() => {
        const loadFuncionarios = async () => {
            try {
                setLoading(true);

                const params = {
                    skip: pagination.skip,
                    limit: pagination.limit,
                    ...filters,
                };

                const response = await funcionarioService.list(params);
                const funcionariosData = response.data || response;

                setFuncionarios(funcionariosData);
                setHasItems(funcionariosData && funcionariosData.length > 0);
            } catch (error) {
                showSnackbar("Erro ao carregar funcionários", "error");
            } finally {
                setLoading(false);
            }
        };

        loadFuncionarios();
    }, [pagination.skip, pagination.limit, filters, showSnackbar]);

    const columns = [
        { field: "id", headerName: "ID" },
        { field: "nome", headerName: "Nome" },
        { field: "cpf", headerName: "CPF" },
        { field: "telefone", headerName: "Telefone" },
        { field: "grupo", headerName: "Grupo" },
        { field: "actions", headerName: "Ações" },
    ];

    const renderGrupo = (grupo) => {
        const grupoInfo = getGrupoInfo(grupo);

        return (
            <Chip
                label={grupoInfo.label}
                color={grupoInfo.color}
                size="small"
            />
        );
    };

    const renderDesktopRow = (funcionario) => (
        <TableRow key={funcionario.id} hover>
            {columns.map((column, index) => {
                if (column.field === "id") {
                    return <TableCell key={index}>{funcionario.id}</TableCell>;
                }

                if (column.field === "nome") {
                    return (
                        <TableCell key={index} sx={{ fontWeight: 500 }}>
                            {funcionario.nome}
                        </TableCell>
                    );
                }

                if (column.field === "cpf") {
                    return <TableCell key={index}>{formatCpf(funcionario.cpf)}</TableCell>;
                }

                if (column.field === "telefone") {
                    return <TableCell key={index}>{formatTelefone(funcionario.telefone)}</TableCell>;
                }

                if (column.field === "grupo") {
                    return <TableCell key={index}>{renderGrupo(funcionario.grupo)}</TableCell>;
                }

                if (column.field === "actions") {
                    return (
                        <TableCell key={index}>
                            <ActionButtons
                                onView={handleView}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                item={funcionario}
                            />
                        </TableCell>
                    );
                }

                return null;
            })}
        </TableRow>
    );

    const renderMobileCard = (funcionario) => (
        <Card key={funcionario.id} sx={{ mb: 2 }}>
            <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {funcionario.nome}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    ID: {funcionario.id}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2">
                    CPF: {formatCpf(funcionario.cpf)}
                </Typography>

                <Typography variant="body2">
                    Telefone: {formatTelefone(funcionario.telefone)}
                </Typography>

                <Box sx={{ mt: 1 }}>
                    {renderGrupo(funcionario.grupo)}
                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <ActionButtons
                        item={funcionario}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <PageLayout title="Funcionários" actions={actions}>
            <FuncionarioFilters
                onFilter={handleFilter}
                onClear={handleClearFilters}
                filters={filters}
            />

            <Box sx={{ mt: 2, display: { xs: "none", md: "block" } }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((column, index) => (
                                    <TableCell key={index} sx={{ fontWeight: 600 }}>
                                        {column.headerName}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {funcionarios.map((funcionario) =>
                                renderDesktopRow(funcionario)
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box sx={{ mt: 2, display: { xs: "block", md: "none" } }}>
                {funcionarios.map((funcionario) => renderMobileCard(funcionario))}
            </Box>

            <Pagination
                currentPage={pagination.currentPage}
                itemsPerPage={pagination.limit}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                loading={loading}
                hasItems={hasItems}
            />
        </PageLayout>
    );
};

export default FuncionarioList;