module.exports = {
    TRUE: '1',
    FALSE: '0',

    AUTH: '1',
    NOAUTH: '0',

    ENABLE: '1',
    DISABLE: '0',
    JOB_STATUS: {
        InProcess:1,
        // Draft:2,
        OnHold:3,
        Filled:4,
        Rejected:5,
    },
    JOB_TEMPLATE_FLG: {
        NORMAL:0,
        TEMPLATE:1,
        DRAFT:2,
        TEMPLATE_AND_DRAFT:3,
    },
    USER_JOB_STATUS: {
        Screening:1,
        Interview:2,
        Offered:3,
        Hired:4,
        Rejected:5,
        Favorite: 6,
        Applied: 7,
        Viewed: 8,
    },
    USER_TYPE: {
        FLYBIRD:'0',
        COMPANY:'1',
        COMPANY_INVIT:'1.5',
        CANDIDATE:'2',
        HIREDADDCANDIDATE:'3',//雇主上传的候选人 可以没有账号密码
        ADMIN: '4'
    },
    SALARY_UNIT: {
      HOUR:0,
      DAY:1,
      MONTH:2,
      YEAR:3
    },
    DEFAULT_PASSWORD: '123456',
    uploadOptions: {
        uploadDir: '../public/temp',
        maxFileSize: 2 * 1024 * 1024*100,
        keepExtensions: true
    },
    filesDir: '../public/files',
    tmpUrlBase: '/temp/',
    fileUrlBase: '/files/',



    REDISKEY: {
        AUTH: 'REDISKEYAUTH',
        SMS: 'REDISKEYSMS',
        WXACT: 'REDISKEYWXACT_HT',
        WXTKT: 'REDISKEYWXTKT_HT',
        MailACT: 'REDISKEYMAILACT',
    },
    USER_SIGN_JOB_STATUS:[
        {
            value: 1,
            label: "Favorite"
        },
        {
            value: 2,
            label: "Applied"
        },
        {
            value: 3,
            label: "Viewed"
        },
        {
            value: 4,
            label: "Interviewing"
        },
        {
            value: 5,
            label: "Offered"
        },
        {
            value: 6,
            label: "Hired"
        },
        {
            value: 7,
            label: "Rejected"
        }
    ],
    googleMapKey:'AIzaSyC8Q2WgAqeFLWOuY02PXuN80W6HNdK_S6I'
};
