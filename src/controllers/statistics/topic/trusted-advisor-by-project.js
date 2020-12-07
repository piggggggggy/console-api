import grpcClient from '@lib/grpc-client';
import logger from '@lib/logger';

const getDefaultQuery = () => {
    return {
        'resource_type': 'inventory.CloudService',
        'query': {
            'aggregate': {
                'group': {
                    'keys': [
                        {
                            'name': 'project_id',
                            'key': 'project_id'
                        },
                        {
                            'name': 'category',
                            'key': 'data.category'
                        }
                    ],
                    'fields': [
                        {
                            'name': 'ok_count',
                            'operator': 'count'
                        }
                    ]
                }
            },
            'filter': [
                {
                    'key': 'provider',
                    'value': 'aws',
                    'operator': 'eq'
                },
                {
                    'key': 'cloud_service_group',
                    'value': 'Support',
                    'operator': 'eq'
                },
                {
                    'key': 'cloud_service_type',
                    'value': 'TrustedAdvisor',
                    'operator': 'eq'
                },
                {
                    'key': 'data.status',
                    'value': 'ok',
                    'operator': 'eq'
                },
                {
                    'key': 'project_id',
                    'value': null,
                    'operator': 'not'
                }
            ]
        },
        'join': [
            {
                'resource_type': 'inventory.CloudService',
                'keys': [
                    'project_id',
                    'category'
                ],
                'query': {
                    'aggregate': {
                        'group': {
                            'keys': [
                                {
                                    'name': 'project_id',
                                    'key': 'project_id'
                                },
                                {
                                    'name': 'category',
                                    'key': 'data.category'
                                }
                            ],
                            'fields': [
                                {
                                    'name': 'warning_count',
                                    'operator': 'count'
                                }
                            ]
                        }
                    },
                    'filter': [
                        {
                            'key': 'provider',
                            'value': 'aws',
                            'operator': 'eq'
                        },
                        {
                            'key': 'cloud_service_group',
                            'value': 'Support',
                            'operator': 'eq'
                        },
                        {
                            'key': 'cloud_service_type',
                            'value': 'TrustedAdvisor',
                            'operator': 'eq'
                        },
                        {
                            'key': 'data.status',
                            'value': 'warning',
                            'operator': 'eq'
                        },
                        {
                            'key': 'project_id',
                            'value': null,
                            'operator': 'not'
                        }
                    ]
                }
            },
            {
                'resource_type': 'inventory.CloudService',
                'keys': [
                    'project_id',
                    'category'
                ],
                'query': {
                    'aggregate': {
                        'group': {
                            'keys': [
                                {
                                    'name': 'project_id',
                                    'key': 'project_id'
                                },
                                {
                                    'name': 'category',
                                    'key': 'data.category'
                                }
                            ],
                            'fields': [
                                {
                                    'name': 'error_count',
                                    'operator': 'count'
                                }
                            ]
                        }
                    },
                    'filter': [
                        {
                            'key': 'provider',
                            'value': 'aws',
                            'operator': 'eq'
                        },
                        {
                            'key': 'cloud_service_group',
                            'value': 'Support',
                            'operator': 'eq'
                        },
                        {
                            'key': 'cloud_service_type',
                            'value': 'TrustedAdvisor',
                            'operator': 'eq'
                        },
                        {
                            'key': 'data.status',
                            'value': 'error',
                            'operator': 'eq'
                        },
                        {
                            'key': 'project_id',
                            'value': null,
                            'operator': 'not'
                        }
                    ]
                }
            }
        ],
        'fill_na': {
            'ok_count': 0,
            'warning_count': 0,
            'error_count': 0
        }
    };
};

const makeRequest = (params) => {
    let requestParams = getDefaultQuery();

    if (params.project_id) {
        requestParams.query.filter.push({
            k: 'project_id',
            v: params.project_id,
            o: 'eq'
        });
        requestParams.join[0].query.filter.push({
            k: 'project_id',
            v: params.project_id,
            o: 'eq'
        });
        requestParams.join[0].query.filter.push({
            k: 'project_id',
            v: params.project_id,
            o: 'eq'
        });
    }

    return requestParams;
};

const trustedAdvisorByProject = async (params) => {
    let statisticsV1 = await grpcClient.get('statistics', 'v1');
    const requestParams = makeRequest(params);
    let response = await statisticsV1.Resource.stat(requestParams);

    return response;
};

export default trustedAdvisorByProject;
