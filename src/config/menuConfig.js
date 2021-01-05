import {
    AppstoreOutlined,
    AreaChartOutlined,
    ContainerOutlined,
    SolutionOutlined,
    TeamOutlined,
    PieChartOutlined,
    BarChartOutlined,
    LineChartOutlined
} from '@ant-design/icons';
const menuList = [
    {
        title: 'Main', //title shown on the page
        key: '/home', //routing address
        icon: <AppstoreOutlined />,//icon name
        isPublic: true,
    },
    {
        title: 'Product',
        key: '/products',
        icon: <ContainerOutlined />,
        children:[
            {
                title: 'Category',
                key: '/category',
                icon: <ContainerOutlined/>
            },
            {
                title: 'Items',
                key: '/product',
                icon: <ContainerOutlined/>
            }
        ]
    },
    {
        title: 'User',
        key: '/user',
        icon: <TeamOutlined />
    },
    {
        title: 'Role',
        key: '/role',
        icon: <SolutionOutlined/>
    },
    {
        title: 'Chart',
        key: '/charts',
        icon: <AreaChartOutlined/>,
        children:[
            {
                title: 'Bar Chart',
                key: '/bar',
                icon: <BarChartOutlined />
            },
            {
                title: 'Line Chart',
                key: '/line',
                icon: <LineChartOutlined />
            },
            {
                title: 'Pie Chart',
                key: '/Pie',
                icon: <PieChartOutlined />
            }
        ]
    }
];
export default menuList