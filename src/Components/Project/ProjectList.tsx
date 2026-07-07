import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { IProject } from '../../Interfaces/IProject';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import "./Project.css";
import { AddBoxTwoTone } from '@mui/icons-material';
import { useEffect } from 'react';
import { mockProjects } from '../../ApiData/db';

interface ProjectList {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}

let rows: IProject[] = [];

function TablePaginationActions(props: ProjectList) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

export function FormDialog() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleClose = () => {
        const newProject: IProject = {
            project_id: rows.length + 1,
            project_title: titre,
            project_type: type,
            project_description: desc,
            project_status: statut,
            project_bigindate: daty1?.format('YYYY-MM-DD') || null,
            project_enddate: daty2?.format('YYYY-MM-DD') || null,
        };
        rows.push(newProject);
        setOpen(false);
    };

    const [type, setType] = React.useState('');
    const handleChangeType = (event: SelectChangeEvent) => {
        setType(event.target.value as string);
    };

    const [statut, setStatut] = React.useState('');
    const handleChangeStatut = (event: SelectChangeEvent) => {
        setStatut(event.target.value as string);
    };

    const [titre, setTitre] = React.useState('');
    const handleTextTitreChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setTitre(event.target.value);
    };

    const [desc, setDesc] = React.useState('');
    const handleTextDescChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setDesc(event.target.value);
    };

    const [daty1, setDaty1] = React.useState<Dayjs | null>(dayjs());
    const [daty2, setDaty2] = React.useState<Dayjs | null>(dayjs());

    return (
        <div>
            <Button color="info" onClick={handleClickOpen} sx={{ top: 2 }}>
                <IconButton> <AddBoxTwoTone fontSize="medium" color="primary" /> </IconButton>Ajouter
            </Button>
            <Dialog open={open} onClose={handleClose} PaperProps={{
                sx: {
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-card)',
                    color: 'var(--text-primary)',
                }
            }}>
                <DialogTitle sx={{ fontWeight: 600 }}>Nouveau projet</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: 'var(--text-secondary)', mb: 2 }}>
                        Remplissez les informations pour créer un nouveau projet.
                    </DialogContentText>

                    <TextField
                        placeholder="Titre du projet"
                        value={titre}
                        onChange={handleTextTitreChange}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Titre"
                        type="text"
                        fullWidth
                        variant="standard"
                        sx={{ input: { color: 'var(--text-primary)' }, label: { color: 'var(--text-muted)' } }}
                    />
                    <InputLabel id="type-id" sx={{ color: 'var(--text-secondary)', mt: 2, fontWeight: 600, fontSize: '0.8125rem' }}>Type du projet</InputLabel>
                    <Select
                        defaultValue='Nouvel fonctionnalité'
                        margin="dense"
                        variant="standard"
                        labelId="type-id"
                        value={type}
                        label="Type"
                        onChange={handleChangeType}
                        sx={{ color: 'var(--text-primary)', width: '100%', '& .MuiSvgIcon-root': { color: 'var(--text-muted)' } }}
                    >
                        <MenuItem value={'Nouvel fonctionnalité'}>Nouvel fonctionnalité</MenuItem>
                        <MenuItem value={'Débogage'}>Débogage</MenuItem>
                    </Select>

                    <InputLabel id="statut-id" sx={{ color: 'var(--text-secondary)', mt: 2, fontWeight: 600, fontSize: '0.8125rem' }}>Statut du projet</InputLabel>
                    <Select
                        defaultValue='EN COURS'
                        margin="dense"
                        variant="standard"
                        labelId="statut-id"
                        value={statut}
                        onChange={handleChangeStatut}
                        sx={{ color: 'var(--text-primary)', width: '100%', '& .MuiSvgIcon-root': { color: 'var(--text-muted)' } }}
                    >
                        <MenuItem value={'EN COURS'}>EN COURS</MenuItem>
                        <MenuItem value={'EN ATTENTE'}>EN ATTENTE</MenuItem>
                        <MenuItem value={'CLOTURER'}>CLOTURER</MenuItem>
                    </Select>

                    <TextField
                        placeholder="Description du projet"
                        value={desc}
                        onChange={handleTextDescChange}
                        margin="dense"
                        label="Description ..."
                        type="text"
                        fullWidth
                        variant="standard"
                        sx={{ input: { color: 'var(--text-primary)' }, label: { color: 'var(--text-muted)' }, mt: 1 }}
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date de début"
                            value={daty1}
                            onChange={(newValue) => setDaty1(newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth variant="standard" margin="dense" sx={{ input: { color: 'var(--text-primary)' }, label: { color: 'var(--text-muted)' } }} />}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date de limite"
                            value={daty2}
                            onChange={(newValue) => setDaty2(newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth variant="standard" margin="dense" sx={{ input: { color: 'var(--text-primary)' }, label: { color: 'var(--text-muted)' } }} />}
                        />
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} sx={{ color: 'var(--text-secondary)' }}>Annuler</Button>
                    <Button onClick={handleClose} sx={{ color: 'var(--accent-1)' }}>Sauvegarder</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

function getData() {
    rows = [...mockProjects];
    return rows;
}

export default function CustomPaginationActionsTable() {
    useEffect(() => {
        getData();
    }, []);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        getData();
        setRowsPerPage(parseInt(event.target.value, 5));
        setPage(0);
    };

    const statusColors: Record<string, string> = {
        'EN COURS': '#4ECDC4',
        'EN ATTENTE': '#FFE66D',
        'CLOTURER': '#A66CFF',
    };

    return (
        <TableContainer component={Paper} sx={{
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-glass)',
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid var(--border-glass)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TaskIcon />
                    <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>Projets</span>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Paper
                        component="form"
                        sx={{
                            p: '2px 4px',
                            display: 'flex',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border-glass)',
                            boxShadow: 'none',
                            borderRadius: 'var(--radius-sm)',
                        }}
                    >
                        <IconButton sx={{ p: '6px', color: 'var(--text-muted)' }} aria-label="menu">
                            <MenuIcon fontSize="small" />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 0.5, flex: 1, color: 'var(--text-primary)', fontSize: '0.875rem' }}
                            placeholder="Recherche"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                        <IconButton type="button" sx={{ p: '6px', color: 'var(--text-muted)' }} aria-label="search">
                            <SearchIcon fontSize="small" />
                        </IconButton>
                    </Paper>
                    <FormDialog />
                </Box>
            </Box>
            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border-glass)' }}>ID</TableCell>
                        <TableCell sx={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border-glass)' }}>Titre</TableCell>
                        <TableCell sx={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border-glass)' }}>Type</TableCell>
                        <TableCell sx={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border-glass)' }}>Description</TableCell>
                        <TableCell sx={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border-glass)' }}>Statut</TableCell>
                        <TableCell sx={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border-glass)' }}>Début</TableCell>
                        <TableCell sx={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border-glass)' }}>Fin</TableCell>
                        <TableCell sx={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border-glass)' }}>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                        ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : rows
                    ).map((row) => (
                        <TableRow key={row.project_id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' } }}>
                            <TableCell sx={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-glass)', fontSize: '0.8125rem' }}>#{row.project_id}</TableCell>
                            <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600, borderBottom: '1px solid var(--border-glass)', fontSize: '0.875rem' }}>{row.project_title}</TableCell>
                            <TableCell sx={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-glass)', fontSize: '0.8125rem' }}>{row.project_type}</TableCell>
                            <TableCell sx={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-glass)', fontSize: '0.8125rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.project_description}</TableCell>
                            <TableCell sx={{ borderBottom: '1px solid var(--border-glass)' }}>
                                <span style={{
                                    background: `${statusColors[row.project_status]}20`,
                                    color: statusColors[row.project_status],
                                    padding: '3px 12px',
                                    borderRadius: '100px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                }}>
                                    {row.project_status}
                                </span>
                            </TableCell>
                            <TableCell sx={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-glass)', fontSize: '0.8125rem' }}>{row.project_bigindate}</TableCell>
                            <TableCell sx={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-glass)', fontSize: '0.8125rem' }}>{row.project_enddate}</TableCell>
                            <TableCell sx={{ borderBottom: '1px solid var(--border-glass)' }}>
                                <IconButton size="small"><EditTwoToneIcon fontSize="small" color="primary" /></IconButton>
                                <IconButton size="small"><DeleteTwoToneIcon fontSize="small" color="error" /></IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={8} sx={{ borderBottom: '1px solid var(--border-glass)' }} />
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={8}
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: { 'aria-label': 'rows per page' },
                                native: true,
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                            sx={{ color: 'var(--text-secondary)', '& .MuiSvgIcon-root': { color: 'var(--text-muted)' } }}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}

function TaskIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="9" x2="15" y2="9"></line>
            <line x1="9" y1="13" x2="15" y2="13"></line>
            <line x1="9" y1="17" x2="13" y2="17"></line>
        </svg>
    );
}
