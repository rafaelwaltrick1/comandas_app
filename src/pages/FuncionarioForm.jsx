import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import {
    Box,
    TextField,
    Button,
    CircularProgress,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";

import PageLayout from "../components/common/PageLayout";
import DuplicateValidator from "../components/common/DuplicateValidator";

import { funcionarioService } from "../services/funcionarioService";
import { useSnackbar } from "../hooks/useSnackbar";

const FuncionarioForm = () => {
    const navigate = useNavigate();
    const { id, opr } = useParams();

    const { showSnackbar } = useSnackbar();

    const {
        control,
        handleSubmit,
        reset,
        getValues,
        setValue,
        formState: {
            errors,
            dirtyFields
        }
    } = useForm({
        defaultValues: {
            nome: "",
            matricula: "",
            cpf: "",
            telefone: "",
            grupo: "",
            senha: ""
        }
    });

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    const [duplicateDialog, setDuplicateDialog] = useState({
        open: false,
        funcionario: null
    });

    const isReadOnly = opr === "view";

    const title = opr === "view"
        ? `Visualizar Funcionário: ${id}`
        : id
            ? `Editar Funcionário: ${id}`
            : "Cadastro de Funcionário";

    const onlyNumbers = (value) => {
        return value ? value.replace(/\D/g, "") : "";
    };

    const formatCpf = (value) => {
        const numbers = onlyNumbers(value).slice(0, 11);

        return numbers
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    };

    const formatTelefone = (value) => {
        const numbers = onlyNumbers(value).slice(0, 11);

        return numbers
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
    };

    const validateDuplicateCpf = async (cpfValue) => {
        const cpfLimpo = onlyNumbers(cpfValue);

        if (!cpfLimpo || cpfLimpo.length < 11 || isReadOnly) {
            return;
        }

        try {
            const response = await funcionarioService.list({
                cpf: cpfLimpo,
                skip: 0,
                limit: 100
            });

            const funcionariosEncontrados = response.data || response;

            const funcionarioDuplicado = funcionariosEncontrados.find((funcionario) => {
                const mesmoCpf = onlyNumbers(funcionario.cpf) === cpfLimpo;
                const naoEhOFuncionarioAtual = !id || Number(funcionario.id) !== Number(id);

                return mesmoCpf && naoEhOFuncionarioAtual;
            });

            if (funcionarioDuplicado) {
                setDuplicateDialog({
                    open: true,
                    funcionario: funcionarioDuplicado
                });
            }
        } catch (error) {
            showSnackbar("Erro ao validar CPF do funcionário.", "error");
        }
    };

    const handleCloseDuplicateDialog = () => {
        setDuplicateDialog({
            open: false,
            funcionario: null
        });

        setValue("cpf", "");
    };

    const handleViewDuplicate = () => {
        const funcionario = duplicateDialog.funcionario;

        setDuplicateDialog({
            open: false,
            funcionario: null
        });

        if (funcionario?.id) {
            navigate(`/funcionario/view/${funcionario.id}`);
        }
    };

    const handleEditDuplicate = () => {
        const funcionario = duplicateDialog.funcionario;

        setDuplicateDialog({
            open: false,
            funcionario: null
        });

        if (funcionario?.id) {
            navigate(`/funcionario/edit/${funcionario.id}`);
        }
    };

    const handleCancel = () => {
        navigate("/funcionarios");
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            const payload = {
                ...data,
                cpf: onlyNumbers(data.cpf),
                telefone: onlyNumbers(data.telefone),
                grupo: Number(data.grupo)
            };

            if (!payload.senha) {
                delete payload.senha;
            }

            await validateDuplicateCpf(payload.cpf);

            let retorno;

            if (id) {
                const changedData = {};

                Object.keys(dirtyFields).forEach((key) => {
                    if (dirtyFields[key]) {
                        changedData[key] = payload[key];
                    }
                });

                if (Object.keys(changedData).length === 0) {
                    showSnackbar("Nenhuma alteração detectada", "info");
                    return;
                }

                retorno = await funcionarioService.update(id, changedData);

                showSnackbar("Funcionário atualizado com sucesso!", "success");
            } else {
                retorno = await funcionarioService.create(payload);

                showSnackbar("Funcionário cadastrado com sucesso!", "success");
            }

            if (!retorno?.id) {
                throw new Error(retorno.detail || "Erro ao salvar funcionário.");
            }

            navigate("/funcionarios");
        } catch (error) {
            const mensagem = error.apiMessage || "Erro ao salvar funcionário";
            showSnackbar(mensagem, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadFuncionario = async () => {
            if (id) {
                try {
                    setLoadingData(true);

                    const data = await funcionarioService.getById(id);

                    reset({
                        nome: data.nome || "",
                        matricula: data.matricula || "",
                        cpf: formatCpf(data.cpf || ""),
                        telefone: formatTelefone(data.telefone || ""),
                        grupo: data.grupo || "",
                        senha: ""
                    });
                } catch (error) {
                    showSnackbar("Erro ao carregar funcionário", "error");
                    navigate("/funcionarios");
                } finally {
                    setLoadingData(false);
                }
            } else {
                setLoadingData(false);
            }
        };

        loadFuncionario();
    }, [id, navigate, reset, showSnackbar]);

    return (
        <PageLayout title={title} maxWidth="md">
            {loadingData ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        p: 4
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2
                    }}
                >
                    {isReadOnly && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Todos os campos estão em modo somente leitura.
                        </Typography>
                    )}

                    <Controller
                        name="nome"
                        control={control}
                        rules={{
                            required: "Nome é obrigatório",
                            maxLength: {
                                value: 100,
                                message: "Nome deve ter no máximo 100 caracteres"
                            }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Nome"
                                fullWidth
                                disabled={isReadOnly}
                                error={!!errors.nome}
                                helperText={errors.nome?.message}
                            />
                        )}
                    />

                    <Controller
                        name="matricula"
                        control={control}
                        rules={{
                            required: "Matrícula é obrigatória",
                            maxLength: {
                                value: 20,
                                message: "Matrícula deve ter no máximo 20 caracteres"
                            }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Matrícula"
                                fullWidth
                                disabled={isReadOnly}
                                error={!!errors.matricula}
                                helperText={errors.matricula?.message}
                            />
                        )}
                    />

                    <Controller
                        name="cpf"
                        control={control}
                        rules={{
                            required: "CPF é obrigatório",
                            validate: (value) =>
                                onlyNumbers(value).length === 11 ||
                                "CPF deve ter 11 números"
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="CPF"
                                fullWidth
                                disabled={isReadOnly}
                                error={!!errors.cpf}
                                helperText={errors.cpf?.message}
                                onChange={(event) => {
                                    field.onChange(formatCpf(event.target.value));
                                }}
                                onBlur={async () => {
                                    field.onBlur();
                                    await validateDuplicateCpf(getValues("cpf"));
                                }}
                            />
                        )}
                    />

                    <Controller
                        name="telefone"
                        control={control}
                        rules={{
                            required: "Telefone é obrigatório",
                            validate: (value) =>
                                onlyNumbers(value).length === 11 ||
                                "Telefone deve ter 11 números"
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Telefone"
                                fullWidth
                                disabled={isReadOnly}
                                error={!!errors.telefone}
                                helperText={errors.telefone?.message}
                                onChange={(event) => {
                                    field.onChange(formatTelefone(event.target.value));
                                }}
                            />
                        )}
                    />

                    <Controller
                        name="grupo"
                        control={control}
                        rules={{
                            required: "Grupo é obrigatório"
                        }}
                        render={({ field }) => (
                            <FormControl
                                fullWidth
                                disabled={isReadOnly}
                                error={!!errors.grupo}
                            >
                                <InputLabel>Grupo</InputLabel>

                                <Select
                                    {...field}
                                    label="Grupo"
                                >
                                    <MenuItem value={1}>Administrador</MenuItem>
                                    <MenuItem value={2}>Atendente</MenuItem>
                                    <MenuItem value={3}>Caixa</MenuItem>
                                </Select>

                                {errors.grupo && (
                                    <Typography
                                        variant="caption"
                                        color="error"
                                        sx={{ mt: 0.5, ml: 2 }}
                                    >
                                        {errors.grupo.message}
                                    </Typography>
                                )}
                            </FormControl>
                        )}
                    />

                    {!isReadOnly && (
                        <Controller
                            name="senha"
                            control={control}
                            rules={{
                                required: !id ? "Senha é obrigatória" : false,
                                minLength: {
                                    value: 6,
                                    message: "Senha deve ter no mínimo 6 caracteres"
                                }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label={id ? "Nova senha (opcional)" : "Senha"}
                                    type="password"
                                    fullWidth
                                    error={!!errors.senha}
                                    helperText={errors.senha?.message}
                                />
                            )}
                        />
                    )}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 2
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>

                        {!isReadOnly && (
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                            >
                                {loading
                                    ? "Salvando..."
                                    : id
                                        ? "Atualizar"
                                        : "Salvar"}
                            </Button>
                        )}
                    </Box>
                </Box>
            )}

            <DuplicateValidator
                open={duplicateDialog.open}
                title="CPF já cadastrado"
                message={
                    duplicateDialog.funcionario
                        ? `Já existe um funcionário cadastrado com este CPF: ${duplicateDialog.funcionario.nome}.`
                        : "Já existe um funcionário cadastrado com este CPF."
                }
                onClose={handleCloseDuplicateDialog}
                onView={handleViewDuplicate}
                onEdit={handleEditDuplicate}
            />
        </PageLayout>
    );
};

export default FuncionarioForm;