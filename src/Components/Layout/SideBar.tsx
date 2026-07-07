import * as React from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Home, Menu, Users, LogOut } from 'react-feather';
import { Task } from '@mui/icons-material';

import './SideBar.css';
import { useHistory, useLocation } from 'react-router-dom';
import Dashboard from '../../Home/Dashboard';
import Avatar from '@mui/material/Avatar';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBarStyled = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    background: 'rgba(10, 10, 26, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    boxShadow: 'none',
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerStyled = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': {
                ...openedMixin(theme),
                background: 'rgba(10, 10, 26, 0.85)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderRight: '1px solid rgba(255, 255, 255, 0.06)',
            },
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': {
                ...closedMixin(theme),
                background: 'rgba(10, 10, 26, 0.85)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderRight: '1px solid rgba(255, 255, 255, 0.06)',
            },
        }),
    }),
);

export default function MiniDrawer() {
    const [open, setOpen] = React.useState(false);
    const location = useLocation();

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    let history = useHistory();

    const isActive = (path: string) => location.pathname === path;

    const itemsList = [
        {
            text: "Accueil",
            icon: <Home size={20} />,
            onClick: () => history.push("/home"),
            path: "/home"
        },
        {
            text: "Projet",
            icon: <Task />,
            onClick: () => history.push("/list_projects"),
            path: "/list_projects"
        },
        {
            text: "Inscription",
            icon: <Users size={20} />,
            onClick: () => history.push("/register"),
            path: "/register"
        }
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        history.push("/");
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBarStyled position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 2,
                            color: 'rgba(255,255,255,0.6)',
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        letterSpacing: '-0.5px',
                        background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        CG Trello
                    </Typography>
                    <Box sx={{ flex: 1 }} />
                    <div className="user-img">
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#6C63FF', fontSize: '0.8rem', fontWeight: 600 }}>
                            A
                        </Avatar>
                    </div>
                </Toolbar>
            </AppBarStyled>
            <DrawerStyled variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose} sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        <Menu size={20} />
                    </IconButton>
                </DrawerHeader>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
                <List sx={{ px: 1, pt: 1 }}>
                    {itemsList.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    onClick={item.onClick}
                                    sx={{
                                        borderRadius: '10px',
                                        minHeight: 44,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2,
                                        background: active ? 'rgba(108, 99, 255, 0.15)' : 'transparent',
                                        '&:hover': {
                                            background: active ? 'rgba(108, 99, 255, 0.2)' : 'rgba(255,255,255,0.05)',
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 2 : 'auto',
                                            justifyContent: 'center',
                                            color: active ? '#6C63FF' : 'rgba(255,255,255,0.4)',
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        sx={{
                                            opacity: open ? 1 : 0,
                                            '& .MuiTypography-root': {
                                                fontWeight: active ? 600 : 400,
                                                fontSize: '0.875rem',
                                                color: active ? '#fff' : 'rgba(255,255,255,0.6)',
                                            },
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
                <Box sx={{ flex: 1 }} />
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
                <List sx={{ px: 1, pb: 1 }}>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={handleLogout}
                            sx={{
                                borderRadius: '10px',
                                minHeight: 44,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2,
                                '&:hover': {
                                    background: 'rgba(255, 101, 132, 0.1)',
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 2 : 'auto',
                                    justifyContent: 'center',
                                    color: 'rgba(255,255,255,0.4)',
                                }}
                            >
                                <LogOut size={20} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Déconnexion"
                                sx={{
                                    opacity: open ? 1 : 0,
                                    '& .MuiTypography-root': {
                                        fontSize: '0.875rem',
                                        color: 'rgba(255,255,255,0.5)',
                                    },
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </DrawerStyled>
            <Box component="main" sx={{ flexGrow: 1, p: 0, overflow: 'hidden' }}>
                <DrawerHeader />
                <Dashboard />
            </Box>
        </Box>
    );
}
