export enum SystemTypes {
    REAN   = 'REAN',
    AHA    = 'AHA',
    Sneha  = 'Sneha',
    GMU    = 'GMU',
    Custom = 'Custom'
}

export interface FeatureOptions {
    Name   : string;
    Enabled: boolean;
}

export const UserRoles = [
    {
        RoleName : 'System admin',
        id   : 1
    },
    {
        RoleName : 'System user',
        id   : 2
    },
    {
        RoleName : 'Patient',
        id   : 3
    },
    {
        RoleName : 'Doctor',
        id   : 4
    },
    {
        RoleName : 'Lab user',
        id   : 5
    },
    {
        RoleName : 'Pharmacy user',
        id   : 6
    },
    {
        RoleName : 'Nurse',
        id   : 7
    },
    {
        RoleName : 'Ambulance service user',
        id   : 8
    },
    {
        RoleName : 'Social health worker',
        id   : 9
    },
    {
        RoleName : 'Patient family member',
        id   : 10
    },
    {
        RoleName : 'Patient friend',
        id   : 11
    },
    {
        RoleName : 'Donor',
        id   : 12
    },
    {
        RoleName : 'Volunteer',
        id   : 13
    },
    {
        RoleName : 'Tenant admin',
        id   : 14
    },
    {
        RoleName : 'Tenant user',
        id   : 15
    }

]
