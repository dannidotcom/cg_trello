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

import { AddBoxTwoTone } from '@mui/icons-material';
import { IUsers } from '../../Interfaces/IUsers';
import { useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import { mockUsers } from '../../ApiData/db';
import { UserPlus } from 'react-feather';

interface UsersList {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}

let rows: IUsers[] = [];

function TablePaginationActions(props: UsersList) {
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

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSave = () => {
        const newUser: IUsers = {
            user_id: rows.length + 1,
            user_username: username,
            user_email: email,
            user_photo: '',
        };
        rows.push(newUser);
        setOpen(false);
    };

    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');

    return (
        <div>
            <Button onClick={handleClickOpen} sx={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AddBoxTwoTone fontSize="medium" color="primary" /> Ajouter
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
                <DialogTitle sx={{ fontWeight: 600 }}>Nouvel utilisateur</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: 'var(--text-secondary)', mb: 2 }}>
                        Ajoutez un nouvel utilisateur à la plateforme.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nom d'utilisateur"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        sx={{ input: { color: 'var(--text-primary)' }, label: { color: 'var(--text-muted)' } }}
                    />
                    <TextField
                        margin="dense"
                        label="Adresse email"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ input: { color: 'var(--text-primary)' }, label: { color: 'var(--text-muted)' } }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{ color: 'var(--text-secondary)' }}>Annuler</Button>
                    <Button onClick={handleSave} sx={{ color: 'var(--accent-1)' }}>Sauvegarder</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

function getData() {
    rows = [...mockUsers];
    return rows;
}

const avatarColors = ["#6C63FF", "#FF6584", "#00D2FF", "#4ECDC4", "#FFE66D"];

function getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
                    <UserPlus size={20} color="#6C63FF" />
                    <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>Utilisateurs</span>
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
                        <TableCell sx={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border-glass)' }}>Photo</TableCell>
                        <TableCell sx={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border-glass)' }}>Nom</TableCell>
                        <TableCell sx={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border-glass)' }}>Email</TableCell>
                        <TableCell sx={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid var(--border-glass)' }}>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                        ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : rows
                    ).map((row) => (
                        <TableRow key={row.user_id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' } }}>
                            <TableCell sx={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-glass)', fontSize: '0.8125rem' }}>#{row.user_id}</TableCell>
                            <TableCell sx={{ borderBottom: '1px solid var(--border-glass)' }}>
                                <Avatar sx={{
                                    width: 36,
                                    height: 36,
                                    bgcolor: avatarColors[row.user_id % avatarColors.length],
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                }}>
                                    {getInitials(row.user_username)}
                                </Avatar>
                            </TableCell>
                            <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600, borderBottom: '1px solid var(--border-glass)', fontSize: '0.875rem' }}>{row.user_username}</TableCell>
                            <TableCell sx={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-glass)', fontSize: '0.8125rem' }}>{row.user_email}</TableCell>
                            <TableCell sx={{ borderBottom: '1px solid var(--border-glass)' }}>
                                <IconButton size="small"><EditTwoToneIcon fontSize="small" color="primary" /></IconButton>
                                <IconButton size="small"><DeleteTwoToneIcon fontSize="small" color="error" /></IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={5} sx={{ borderBottom: '1px solid var(--border-glass)' }} />
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={5}
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
