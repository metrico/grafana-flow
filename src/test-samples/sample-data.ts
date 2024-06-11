import { FieldType, LoadingState, PanelData, dateTime } from "@grafana/data";

export const sampleData: PanelData = {
    state: LoadingState.Done,
    timeRange: {
        "from": dateTime("2024-06-6T14:33:34.215Z"),
        "to": dateTime("2024-06-6T15:03:34.215Z"),
        "raw": {
            "from": "2024-06-6T14:33:34.215Z",
            "to": "2024-06-6T15:03:34.215Z"
        }
    },
    "series": [
        {
            "refId": "A",
            "fields": [
                {
                    "name": "labels",
                    "type": FieldType.other,
                    "config": {},
                    "values": [
                        {
                            "callid": "plwj7a@127.0.0.1_b2b-1",
                            "dst_ip": "93.172.7.63",
                            "dst_port": "5060",
                            "hostname": "b6f17faf8431",
                            "job": "heplify-server",
                            "method": "ACK",
                            "node": "2001",
                            "response": "ACK",
                            "src_ip": "216.187.19.159",
                            "src_port": "5060",
                            "type": "sip",
                            "timestamp": 1718031813685
                        },
                        {
                            "dst_ip": "93.172.7.63",
                            "dst_port": "0",
                            "hostname": "b6f17faf8431",
                            "job": "heplify-server",
                            "node": "2001",
                            "src_ip": "216.187.19.159",
                            "src_port": "0",
                            "type": "rtcp",
                            "timestamp": 1718031813885
                        },
                        {
                            "callid": "b7jl7s@127.0.0.1",
                            "dst_ip": "8.76.6.57",
                            "dst_port": "5064",
                            "hostname": "b6f17faf8431",
                            "job": "heplify-server",
                            "method": "INVITE",
                            "node": "2001",
                            "response": "407",
                            "src_ip": "17.103.77.199",
                            "src_port": "5060",
                            "type": "sip",
                            "timestamp": 1718031804118
                        },
                        {
                            "callid": "b7jl7s@127.0.0.1",
                            "dst_ip": "8.76.6.57",
                            "dst_port": "5064",
                            "hostname": "b6f17faf8431",
                            "job": "heplify-server",
                            "method": "INVITE",
                            "node": "2001",
                            "response": "200",
                            "src_ip": "17.103.77.199",
                            "src_port": "5060",
                            "type": "sip",
                            "timestamp": 1718031807868
                        },
                        {
                            "callid": "b7jl7s@127.0.0.1",
                            "dst_ip": "8.76.6.57",
                            "dst_port": "5064",
                            "hostname": "b6f17faf8431",
                            "job": "heplify-server",
                            "method": "INVITE",
                            "node": "2001",
                            "response": "100",
                            "src_ip": "17.103.77.199",
                            "src_port": "5060",
                            "type": "sip",
                            "timestamp": 1718031805368
                        }
                    ],
                    "state": null
                },
                {
                    "name": "Time",
                    "type": FieldType.time,
                    "config": {},
                    "values": [
                        1718031813685,
                        1718031813885,
                        1718031804118,
                        1718031807868,
                        1718031805368,],
                    "state": null
                },
                {
                    "name": "Line",
                    "type": FieldType.string,
                    "config": {},
                    "values": ["ACK sip:109@93.172.7.63:7070 SIP/2.0\r\nMax-Forwards: 10\r\nRecord-Route: <sip:216.187.19.159;r2=on;lr=on;ftag=06DE7CEB-56E458BB000864AD-B855F700;lb=yes>\r\nRecord-Route: <sip:127.0.0.1;r2=on;lr=on;ftag=06DE7CEB-56E458BB000864AD-B855F700;lb=yes>\r\nVia: SIP/2.0/UDP 216.187.19.159;branch=z9hG4bK3365.4e589db6a3d69d4d4ee211444d6d8d29.0\r\nVia: SIP/2.0/UDP 127.0.0.1:5080;branch=z9hG4bKarC4XaNK;rport=5080\r\nFrom: <sip:+85555243550@sipcapture.org>;tag=06DE7CEB-56E458BB000864AD-B855F700\r\nTo: <sip:109@93.172.7.63>;tag=as6db2fc4d\r\nCSeq: 10 ACK\r\nCall-ID: plwj7a@127.0.0.1_b2b-1\r\nRoute: <sip:93.172.7.63;lr;ftag=06DE7CEB-56E458BB000864AD-B855F700>\r\nSupported: replaces, path, timer, eventlist\r\nUser-Agent: HEPGEN.JS@sipcapture.org\r\nAllow: INVITE, ACK, OPTIONS, CANCEL, BYE, SUBSCRIBE, NOTIFY, INFO, REFER, UPDATE, MESSAGE\r\nContent-Length: 0\r\nContact: <sip:lb@216.187.19.159:5060;ngcpct=c2lwOjEyNy4wLjAuMTo1MDgw>\r\n\r\n\r\n",
                        "{\"type\":200,\"ssrc\":1814766290,\"report_count\":0,\"report_blocks\":[],\"sender_information\":{\"packets\":2,\"ntp_timestamp_sec\":\"3373905459\",\"ntp_timestamp_usec\":\"4280379832\",\"rtp_timestamp\":-210833031,\"octets\":40}} ",
                        "SIP/2.0 407 Proxy Authentication Required\r\nVia: SIP/2.0/UDP 192.168.10.129:5064;received=8.76.6.57;branch=z9hG4bK923381359;rport=5064\r\nFrom: <sip:hepgenjs@sipcapture.org;user=phone>;tag=415746302\r\nTo: <sip:123@sipcapture.org;user=phone>;tag=1d24a28a0bded6c40d31e6db8aab9ac6.0385\r\nCall-ID: b7jl7s@127.0.0.1\r\nCSeq: 440 INVITE\r\nProxy-Authenticate: Digest realm=\"sipcapture.org\", nonce=\"VuRZ5VbkWLkkVKJ9B1rBIN9Q3nRbqc9z\"\r\nServer: SIP Proxy\r\nContent-Length: 0\r\n\r\n\r\n",
                        "SIP/2.0 200 OK\r\nRecord-Route: <sip:127.0.0.1:5062;lr=on;ftag=415746302;did=d5d.c191;mpd=ii;ice_caller=strip;ice_callee=strip;rtpprx=yes;vsf=YlB4MwAQcRpkPgIJNBwOYAhoe188D24/UEcsTigdagkbLCgy>\r\nRecord-Route: <sip:127.0.0.1;r2=on;lr=on;ftag=415746302;nat=yes;lb=yes;socket=udp:17.103.77.199:5060>\r\nRecord-Route: <sip:17.103.77.199;r2=on;lr=on;ftag=415746302;nat=yes;lb=yes;socket=udp:17.103.77.199:5060>\r\nVia: SIP/2.0/UDP 192.168.10.129:5064;received=8.76.6.57;branch=z9hG4bK104237110;rport=5064\r\nFrom: <sip:hepgenjs@sipcapture.org;user=phone>;tag=415746302\r\nTo: <sip:123@sipcapture.org;user=phone>;tag=7DB80AAE-56E458BB0008256B-B7852700\r\nCall-ID: b7jl7s@127.0.0.1\r\nCSeq: 441 INVITE\r\nUser-Agent: HEPeer\r\nAllow: INVITE, ACK, CANCEL, OPTIONS, BYE, REFER, SUBSCRIBE, NOTIFY\r\nSupported: replaces\r\nContent-Type: application/sdp\r\nContent-Length: 329\r\nContact: <sip:lb@17.103.77.199:5060;ngcpct=c2lwOjEyNy4wLjAuMTo1MDgw>\r\n\r\nv=0\r\no=root 11882 11882 IN IP4 17.103.77.199\r\ns=session\r\nc=IN IP4 17.103.77.199\r\nt=0 0\r\nm=audio 31956 RTP/AVP 8 0 18 101\r\na=rtpmap:8 PCMA/8000\r\na=rtpmap:0 PCMU/8000\r\na=rtpmap:18 G729/8000\r\na=fmtp:18 annexb=no\r\na=rtpmap:101 telephone-event/8000\r\na=fmtp:101 0-16\r\na=silenceSupp:off - - - -\r\na=ptime:20\r\na=sendrecv\r\na=rtcp:31957\r\n\r\n\r\n",
                        "SIP/2.0 100 Trying\r\nVia: SIP/2.0/UDP 192.168.10.129:5064;received=8.76.6.57;branch=z9hG4bK104237110;rport=5064\r\nFrom: <sip:hepgenjs@sipcapture.org;user=phone>;tag=415746302\r\nTo: <sip:123@sipcapture.org;user=phone>\r\nCall-ID: b7jl7s@127.0.0.1\r\nCSeq: 441 INVITE\r\nServer: SIP Proxy\r\nContent-Length: 0\r\n\r\n\r\n",
                    ],
                    "state": null
                },
                {
                    "name": "tsNs",
                    "type": FieldType.string,
                    "config": {},
                    "values": [
                        "1718031813685000000",
                        "1718031813885000000",
                        "1718031804118000000",
                        "1718031807868000000",
                        "1718031805368000000",],
                    "state": null
                },
                {
                    "name": "id",
                    "type": FieldType.string,
                    "config": {},
                    "values": [
                        "1718031813685000000_a9231678",
                        "1718031813885000000_e209a8b",
                        "1718031804118000000_3ab4c30",
                        "1718031807868000000_fb459212",
                        "1718031805368000000_be944f35",],
                    "state": null
                },
                {
                    "name": "traceId",
                    "type": FieldType.string,
                    "config": {
                        "links": [
                            {
                                "title": "",
                                "url": "",
                                "internal": {
                                    "query": {
                                        "query": "${__value.raw}",
                                        "queryType": "traceql"
                                    },
                                    "datasourceUid": "tempo",
                                    "datasourceName": "Tempo"
                                }
                            }
                        ]
                    },
                    "values": [
                        null,
                        null,
                        null,
                        null,
                        null
                    ],
                    "state": null
                },
                {
                    "name": "traceID",
                    "type": FieldType.string,
                    "config": {
                        "links": [
                            {
                                "title": "",
                                "url": "",
                                "internal": {
                                    "query": {
                                        "query": "${__value.raw}",
                                        "queryType": "traceql"
                                    },
                                    "datasourceUid": "tempo",
                                    "datasourceName": "Tempo"
                                }
                            }
                        ]
                    },
                    "values": [
                        null,
                        null,
                        null,
                        null,
                        null],
                    "state": null
                },
                {
                    "name": "callid",
                    "type": FieldType.string,
                    "config": {
                        "links": [
                            {
                                "title": "Call Flow",
                                "url": "/d/homer10/call-flow?var-search=${__value.raw}"
                            }
                        ]
                    },
                    "values": [
                        "plwj7a@127.0.0.1_b2b-1",
                        null,
                        "b7jl7s@127.0.0.1",
                        "b7jl7s@127.0.0.1",
                        "b7jl7s@127.0.0.1",],
                    "state": null
                },
                {
                    "name": "correlationId",
                    "type": FieldType.string,
                    "config": {
                        "links": [
                            {
                                "title": "Call Flow",
                                "url": "/d/homer10/call-flow?var-search=${__value.raw}"
                            }
                        ]
                    },
                    "values": [
                        null,
                        null,
                        null,
                        null,
                        null],
                    "state": null
                }
            ],
            "length": 100,
            "meta": {
                "typeVersion": [
                    0,
                    0
                ],
                "custom": {
                    "frameType": "LabeledTimeValues",
                    "lokiQueryStatKey": "Summary: total bytes processed"
                },
                "executedQueryString": "Expr: {job=\"heplify-server\", src_ip=~\".*\", dst_ip=~\".*\"} | response=~\".*\" or type!=\"sip\" |~ `.*` | regexp \"Call-ID:\\s+(?<callid>.+?)\\r\\n\"",
                "preferredVisualisationType": "logs",
                "limit": 100,
                "searchWords": [
                    "${search:raw}"
                ]
            }
        }
    ],
    "annotations": [],
    "request": {
        "app": "dashboard",
        "requestId": "Q103",
        "timezone": "browser",
        "panelId": 1,
        "dashboardUID": "homer10",
        "range": {
            "from": dateTime("2024-06-6T14:33:34.215Z"),
            "to": dateTime("2024-06-6T15:03:34.215Z"),
            "raw": {
                "from": "now-15m",
                "to": "now"
            }
        },
        "timeInfo": "",
        "interval": "500ms",
        "intervalMs": 500,
        "targets": [
            {
                "datasource": {
                    "type": "loki",
                    "uid": "loki"
                },
                "key": "Q-c40f2e2b-564b-49f7-affa-cdeff6d70adf-0",
                "queryType": "range",
                "refId": "A"
            }
        ],
        "maxDataPoints": 1575,
        "scopedVars": {
            "__interval": {
                "text": "500ms",
                "value": "500ms"
            },
            "__interval_ms": {
                "text": "500",
                "value": 500
            }
        },
        "startTime": 1718031814215,
        "endTime": 1718031814291
    },
    "timings": {
        "dataProcessingTime": 0
    },
    "structureRev": 2
}
export const sampleDataFormattedAndSortedOldFirst = [
    {
        "labels": {
            "callid": "b7jl7s@127.0.0.1",
            "dst_ip": "8.76.6.57",
            "dst_port": "5064",
            "hostname": "b6f17faf8431",
            "job": "heplify-server",
            "method": "INVITE",
            "node": "2001",
            "response": "407",
            "src_ip": "17.103.77.199",
            "src_port": "5060",
            "type": "sip",
            "timestamp": 1718031804118
        },
        "Time": 1718031804118,
        "Line": "SIP/2.0 407 Proxy Authentication Required\r\nVia: SIP/2.0/UDP 192.168.10.129:5064;received=8.76.6.57;branch=z9hG4bK923381359;rport=5064\r\nFrom: <sip:hepgenjs@sipcapture.org;user=phone>;tag=415746302\r\nTo: <sip:123@sipcapture.org;user=phone>;tag=1d24a28a0bded6c40d31e6db8aab9ac6.0385\r\nCall-ID: b7jl7s@127.0.0.1\r\nCSeq: 440 INVITE\r\nProxy-Authenticate: Digest realm=\"sipcapture.org\", nonce=\"VuRZ5VbkWLkkVKJ9B1rBIN9Q3nRbqc9z\"\r\nServer: SIP Proxy\r\nContent-Length: 0\r\n\r\n\r\n",
        "tsNs": "1718031804118000000",
        "id": "1718031804118000000_3ab4c30",
        "traceId": null,
        "traceID": null,
        "callid": "b7jl7s@127.0.0.1",
        "correlationId": null
    },
    {
        "labels": {
            "callid": "b7jl7s@127.0.0.1",
            "dst_ip": "8.76.6.57",
            "dst_port": "5064",
            "hostname": "b6f17faf8431",
            "job": "heplify-server",
            "method": "INVITE",
            "node": "2001",
            "response": "100",
            "src_ip": "17.103.77.199",
            "src_port": "5060",
            "type": "sip",
            "timestamp": 1718031805368
        },
        "Time": 1718031805368,
        "Line": "SIP/2.0 100 Trying\r\nVia: SIP/2.0/UDP 192.168.10.129:5064;received=8.76.6.57;branch=z9hG4bK104237110;rport=5064\r\nFrom: <sip:hepgenjs@sipcapture.org;user=phone>;tag=415746302\r\nTo: <sip:123@sipcapture.org;user=phone>\r\nCall-ID: b7jl7s@127.0.0.1\r\nCSeq: 441 INVITE\r\nServer: SIP Proxy\r\nContent-Length: 0\r\n\r\n\r\n",
        "tsNs": "1718031805368000000",
        "id": "1718031805368000000_be944f35",
        "traceId": null,
        "traceID": null,
        "callid": "b7jl7s@127.0.0.1",
        "correlationId": null
    },
    {
        "labels": {
            "callid": "b7jl7s@127.0.0.1",
            "dst_ip": "8.76.6.57",
            "dst_port": "5064",
            "hostname": "b6f17faf8431",
            "job": "heplify-server",
            "method": "INVITE",
            "node": "2001",
            "response": "200",
            "src_ip": "17.103.77.199",
            "src_port": "5060",
            "type": "sip",
            "timestamp": 1718031807868
        },
        "Time": 1718031807868,
        "Line": "SIP/2.0 200 OK\r\nRecord-Route: <sip:127.0.0.1:5062;lr=on;ftag=415746302;did=d5d.c191;mpd=ii;ice_caller=strip;ice_callee=strip;rtpprx=yes;vsf=YlB4MwAQcRpkPgIJNBwOYAhoe188D24/UEcsTigdagkbLCgy>\r\nRecord-Route: <sip:127.0.0.1;r2=on;lr=on;ftag=415746302;nat=yes;lb=yes;socket=udp:17.103.77.199:5060>\r\nRecord-Route: <sip:17.103.77.199;r2=on;lr=on;ftag=415746302;nat=yes;lb=yes;socket=udp:17.103.77.199:5060>\r\nVia: SIP/2.0/UDP 192.168.10.129:5064;received=8.76.6.57;branch=z9hG4bK104237110;rport=5064\r\nFrom: <sip:hepgenjs@sipcapture.org;user=phone>;tag=415746302\r\nTo: <sip:123@sipcapture.org;user=phone>;tag=7DB80AAE-56E458BB0008256B-B7852700\r\nCall-ID: b7jl7s@127.0.0.1\r\nCSeq: 441 INVITE\r\nUser-Agent: HEPeer\r\nAllow: INVITE, ACK, CANCEL, OPTIONS, BYE, REFER, SUBSCRIBE, NOTIFY\r\nSupported: replaces\r\nContent-Type: application/sdp\r\nContent-Length: 329\r\nContact: <sip:lb@17.103.77.199:5060;ngcpct=c2lwOjEyNy4wLjAuMTo1MDgw>\r\n\r\nv=0\r\no=root 11882 11882 IN IP4 17.103.77.199\r\ns=session\r\nc=IN IP4 17.103.77.199\r\nt=0 0\r\nm=audio 31956 RTP/AVP 8 0 18 101\r\na=rtpmap:8 PCMA/8000\r\na=rtpmap:0 PCMU/8000\r\na=rtpmap:18 G729/8000\r\na=fmtp:18 annexb=no\r\na=rtpmap:101 telephone-event/8000\r\na=fmtp:101 0-16\r\na=silenceSupp:off - - - -\r\na=ptime:20\r\na=sendrecv\r\na=rtcp:31957\r\n\r\n\r\n",
        "tsNs": "1718031807868000000",
        "id": "1718031807868000000_fb459212",
        "traceId": null,
        "traceID": null,
        "callid": "b7jl7s@127.0.0.1",
        "correlationId": null
    },
    {
        "labels": {
            "callid": "plwj7a@127.0.0.1_b2b-1",
            "dst_ip": "93.172.7.63",
            "dst_port": "5060",
            "hostname": "b6f17faf8431",
            "job": "heplify-server",
            "method": "ACK",
            "node": "2001",
            "response": "ACK",
            "src_ip": "216.187.19.159",
            "src_port": "5060",
            "type": "sip",
            "timestamp": 1718031813685
        },
        "Time": 1718031813685,
        "Line": "ACK sip:109@93.172.7.63:7070 SIP/2.0\r\nMax-Forwards: 10\r\nRecord-Route: <sip:216.187.19.159;r2=on;lr=on;ftag=06DE7CEB-56E458BB000864AD-B855F700;lb=yes>\r\nRecord-Route: <sip:127.0.0.1;r2=on;lr=on;ftag=06DE7CEB-56E458BB000864AD-B855F700;lb=yes>\r\nVia: SIP/2.0/UDP 216.187.19.159;branch=z9hG4bK3365.4e589db6a3d69d4d4ee211444d6d8d29.0\r\nVia: SIP/2.0/UDP 127.0.0.1:5080;branch=z9hG4bKarC4XaNK;rport=5080\r\nFrom: <sip:+85555243550@sipcapture.org>;tag=06DE7CEB-56E458BB000864AD-B855F700\r\nTo: <sip:109@93.172.7.63>;tag=as6db2fc4d\r\nCSeq: 10 ACK\r\nCall-ID: plwj7a@127.0.0.1_b2b-1\r\nRoute: <sip:93.172.7.63;lr;ftag=06DE7CEB-56E458BB000864AD-B855F700>\r\nSupported: replaces, path, timer, eventlist\r\nUser-Agent: HEPGEN.JS@sipcapture.org\r\nAllow: INVITE, ACK, OPTIONS, CANCEL, BYE, SUBSCRIBE, NOTIFY, INFO, REFER, UPDATE, MESSAGE\r\nContent-Length: 0\r\nContact: <sip:lb@216.187.19.159:5060;ngcpct=c2lwOjEyNy4wLjAuMTo1MDgw>\r\n\r\n\r\n",
        "tsNs": "1718031813685000000",
        "id": "1718031813685000000_a9231678",
        "traceId": null,
        "traceID": null,
        "callid": "plwj7a@127.0.0.1_b2b-1",
        "correlationId": null
    },
    {
        "labels": {
            "dst_ip": "93.172.7.63",
            "dst_port": "0",
            "hostname": "b6f17faf8431",
            "job": "heplify-server",
            "node": "2001",
            "src_ip": "216.187.19.159",
            "src_port": "0",
            "type": "rtcp",
            "timestamp": 1718031813885
        },
        "Time": 1718031813885,
        "Line": "{\"type\":200,\"ssrc\":1814766290,\"report_count\":0,\"report_blocks\":[],\"sender_information\":{\"packets\":2,\"ntp_timestamp_sec\":\"3373905459\",\"ntp_timestamp_usec\":\"4280379832\",\"rtp_timestamp\":-210833031,\"octets\":40}} ",
        "tsNs": "1718031813885000000",
        "id": "1718031813885000000_e209a8b",
        "traceId": null,
        "traceID": null,
        "callid": null,
        "correlationId": null
    }
]
export const sampleDataFormattedAndSortedNewFirst = [
    {
        "labels": {
            "callid": "b7jl7s@127.0.0.1",
            "dst_ip": "8.76.6.57",
            "dst_port": "5064",
            "hostname": "b6f17faf8431",
            "job": "heplify-server",
            "method": "INVITE",
            "node": "2001",
            "response": "407",
            "src_ip": "17.103.77.199",
            "src_port": "5060",
            "type": "sip",
            "timestamp": 1718031804118
        },
        "Time": 1718031804118,
        "Line": "SIP/2.0 407 Proxy Authentication Required\r\nVia: SIP/2.0/UDP 192.168.10.129:5064;received=8.76.6.57;branch=z9hG4bK923381359;rport=5064\r\nFrom: <sip:hepgenjs@sipcapture.org;user=phone>;tag=415746302\r\nTo: <sip:123@sipcapture.org;user=phone>;tag=1d24a28a0bded6c40d31e6db8aab9ac6.0385\r\nCall-ID: b7jl7s@127.0.0.1\r\nCSeq: 440 INVITE\r\nProxy-Authenticate: Digest realm=\"sipcapture.org\", nonce=\"VuRZ5VbkWLkkVKJ9B1rBIN9Q3nRbqc9z\"\r\nServer: SIP Proxy\r\nContent-Length: 0\r\n\r\n\r\n",
        "tsNs": "1718031804118000000",
        "id": "1718031804118000000_3ab4c30",
        "traceId": null,
        "traceID": null,
        "callid": "b7jl7s@127.0.0.1",
        "correlationId": null
    },
    {
        "labels": {
            "callid": "b7jl7s@127.0.0.1",
            "dst_ip": "8.76.6.57",
            "dst_port": "5064",
            "hostname": "b6f17faf8431",
            "job": "heplify-server",
            "method": "INVITE",
            "node": "2001",
            "response": "100",
            "src_ip": "17.103.77.199",
            "src_port": "5060",
            "type": "sip",
            "timestamp": 1718031805368
        },
        "Time": 1718031805368,
        "Line": "SIP/2.0 100 Trying\r\nVia: SIP/2.0/UDP 192.168.10.129:5064;received=8.76.6.57;branch=z9hG4bK104237110;rport=5064\r\nFrom: <sip:hepgenjs@sipcapture.org;user=phone>;tag=415746302\r\nTo: <sip:123@sipcapture.org;user=phone>\r\nCall-ID: b7jl7s@127.0.0.1\r\nCSeq: 441 INVITE\r\nServer: SIP Proxy\r\nContent-Length: 0\r\n\r\n\r\n",
        "tsNs": "1718031805368000000",
        "id": "1718031805368000000_be944f35",
        "traceId": null,
        "traceID": null,
        "callid": "b7jl7s@127.0.0.1",
        "correlationId": null
    },
    {
        "labels": {
            "callid": "b7jl7s@127.0.0.1",
            "dst_ip": "8.76.6.57",
            "dst_port": "5064",
            "hostname": "b6f17faf8431",
            "job": "heplify-server",
            "method": "INVITE",
            "node": "2001",
            "response": "200",
            "src_ip": "17.103.77.199",
            "src_port": "5060",
            "type": "sip",
            "timestamp": 1718031807868
        },
        "Time": 1718031807868,
        "Line": "SIP/2.0 200 OK\r\nRecord-Route: <sip:127.0.0.1:5062;lr=on;ftag=415746302;did=d5d.c191;mpd=ii;ice_caller=strip;ice_callee=strip;rtpprx=yes;vsf=YlB4MwAQcRpkPgIJNBwOYAhoe188D24/UEcsTigdagkbLCgy>\r\nRecord-Route: <sip:127.0.0.1;r2=on;lr=on;ftag=415746302;nat=yes;lb=yes;socket=udp:17.103.77.199:5060>\r\nRecord-Route: <sip:17.103.77.199;r2=on;lr=on;ftag=415746302;nat=yes;lb=yes;socket=udp:17.103.77.199:5060>\r\nVia: SIP/2.0/UDP 192.168.10.129:5064;received=8.76.6.57;branch=z9hG4bK104237110;rport=5064\r\nFrom: <sip:hepgenjs@sipcapture.org;user=phone>;tag=415746302\r\nTo: <sip:123@sipcapture.org;user=phone>;tag=7DB80AAE-56E458BB0008256B-B7852700\r\nCall-ID: b7jl7s@127.0.0.1\r\nCSeq: 441 INVITE\r\nUser-Agent: HEPeer\r\nAllow: INVITE, ACK, CANCEL, OPTIONS, BYE, REFER, SUBSCRIBE, NOTIFY\r\nSupported: replaces\r\nContent-Type: application/sdp\r\nContent-Length: 329\r\nContact: <sip:lb@17.103.77.199:5060;ngcpct=c2lwOjEyNy4wLjAuMTo1MDgw>\r\n\r\nv=0\r\no=root 11882 11882 IN IP4 17.103.77.199\r\ns=session\r\nc=IN IP4 17.103.77.199\r\nt=0 0\r\nm=audio 31956 RTP/AVP 8 0 18 101\r\na=rtpmap:8 PCMA/8000\r\na=rtpmap:0 PCMU/8000\r\na=rtpmap:18 G729/8000\r\na=fmtp:18 annexb=no\r\na=rtpmap:101 telephone-event/8000\r\na=fmtp:101 0-16\r\na=silenceSupp:off - - - -\r\na=ptime:20\r\na=sendrecv\r\na=rtcp:31957\r\n\r\n\r\n",
        "tsNs": "1718031807868000000",
        "id": "1718031807868000000_fb459212",
        "traceId": null,
        "traceID": null,
        "callid": "b7jl7s@127.0.0.1",
        "correlationId": null
    },
    {
        "labels": {
            "callid": "plwj7a@127.0.0.1_b2b-1",
            "dst_ip": "93.172.7.63",
            "dst_port": "5060",
            "hostname": "b6f17faf8431",
            "job": "heplify-server",
            "method": "ACK",
            "node": "2001",
            "response": "ACK",
            "src_ip": "216.187.19.159",
            "src_port": "5060",
            "type": "sip",
            "timestamp": 1718031813685
        },
        "Time": 1718031813685,
        "Line": "ACK sip:109@93.172.7.63:7070 SIP/2.0\r\nMax-Forwards: 10\r\nRecord-Route: <sip:216.187.19.159;r2=on;lr=on;ftag=06DE7CEB-56E458BB000864AD-B855F700;lb=yes>\r\nRecord-Route: <sip:127.0.0.1;r2=on;lr=on;ftag=06DE7CEB-56E458BB000864AD-B855F700;lb=yes>\r\nVia: SIP/2.0/UDP 216.187.19.159;branch=z9hG4bK3365.4e589db6a3d69d4d4ee211444d6d8d29.0\r\nVia: SIP/2.0/UDP 127.0.0.1:5080;branch=z9hG4bKarC4XaNK;rport=5080\r\nFrom: <sip:+85555243550@sipcapture.org>;tag=06DE7CEB-56E458BB000864AD-B855F700\r\nTo: <sip:109@93.172.7.63>;tag=as6db2fc4d\r\nCSeq: 10 ACK\r\nCall-ID: plwj7a@127.0.0.1_b2b-1\r\nRoute: <sip:93.172.7.63;lr;ftag=06DE7CEB-56E458BB000864AD-B855F700>\r\nSupported: replaces, path, timer, eventlist\r\nUser-Agent: HEPGEN.JS@sipcapture.org\r\nAllow: INVITE, ACK, OPTIONS, CANCEL, BYE, SUBSCRIBE, NOTIFY, INFO, REFER, UPDATE, MESSAGE\r\nContent-Length: 0\r\nContact: <sip:lb@216.187.19.159:5060;ngcpct=c2lwOjEyNy4wLjAuMTo1MDgw>\r\n\r\n\r\n",
        "tsNs": "1718031813685000000",
        "id": "1718031813685000000_a9231678",
        "traceId": null,
        "traceID": null,
        "callid": "plwj7a@127.0.0.1_b2b-1",
        "correlationId": null
    },
    {
        "labels": {
            "dst_ip": "93.172.7.63",
            "dst_port": "0",
            "hostname": "b6f17faf8431",
            "job": "heplify-server",
            "node": "2001",
            "src_ip": "216.187.19.159",
            "src_port": "0",
            "type": "rtcp",
            "timestamp": 1718031813885
        },
        "Time": 1718031813885,
        "Line": "{\"type\":200,\"ssrc\":1814766290,\"report_count\":0,\"report_blocks\":[],\"sender_information\":{\"packets\":2,\"ntp_timestamp_sec\":\"3373905459\",\"ntp_timestamp_usec\":\"4280379832\",\"rtp_timestamp\":-210833031,\"octets\":40}} ",
        "tsNs": "1718031813885000000",
        "id": "1718031813885000000_e209a8b",
        "traceId": null,
        "traceID": null,
        "callid": null,
        "correlationId": null
    }
]
export const sampleDataFormattedAndUnsorted = [
    {
        "labels": {
            "callid": "plwj7a@127.0.0.1_b2b-1",
            "dst_ip": "93.172.7.63",
            "dst_port": "5060",
            "hostname": "b6f17faf8431",
            "job": "heplify-server",
            "method": "ACK",
            "node": "2001",
            "response": "ACK",
            "src_ip": "216.187.19.159",
            "src_port": "5060",
            "type": "sip",
            "timestamp": 1718031813685
        },
        "Time": 1718031813685,
        "Line": "ACK sip:109@93.172.7.63:7070 SIP/2.0\r\nMax-Forwards: 10\r\nRecord-Route: <sip:216.187.19.159;r2=on;lr=on;ftag=06DE7CEB-56E458BB000864AD-B855F700;lb=yes>\r\nRecord-Route: <sip:127.0.0.1;r2=on;lr=on;ftag=06DE7CEB-56E458BB000864AD-B855F700;lb=yes>\r\nVia: SIP/2.0/UDP 216.187.19.159;branch=z9hG4bK3365.4e589db6a3d69d4d4ee211444d6d8d29.0\r\nVia: SIP/2.0/UDP 127.0.0.1:5080;branch=z9hG4bKarC4XaNK;rport=5080\r\nFrom: <sip:+85555243550@sipcapture.org>;tag=06DE7CEB-56E458BB000864AD-B855F700\r\nTo: <sip:109@93.172.7.63>;tag=as6db2fc4d\r\nCSeq: 10 ACK\r\nCall-ID: plwj7a@127.0.0.1_b2b-1\r\nRoute: <sip:93.172.7.63;lr;ftag=06DE7CEB-56E458BB000864AD-B855F700>\r\nSupported: replaces, path, timer, eventlist\r\nUser-Agent: HEPGEN.JS@sipcapture.org\r\nAllow: INVITE, ACK, OPTIONS, CANCEL, BYE, SUBSCRIBE, NOTIFY, INFO, REFER, UPDATE, MESSAGE\r\nContent-Length: 0\r\nContact: <sip:lb@216.187.19.159:5060;ngcpct=c2lwOjEyNy4wLjAuMTo1MDgw>\r\n\r\n\r\n",
        "tsNs": "1718031813685000000",
        "id": "1718031813685000000_a9231678",
        "traceId": null,
        "traceID": null,
        "callid": "plwj7a@127.0.0.1_b2b-1",
        "correlationId": null
    },
    {
        "labels": {
            "dst_ip": "93.172.7.63",
            "dst_port": "0",
            "hostname": "b6f17faf8431",
            "job": "heplify-server",
            "node": "2001",
            "src_ip": "216.187.19.159",
            "src_port": "0",
            "type": "rtcp",
            "timestamp": 1718031813885
        },
        "Time": 1718031813885,
        "Line": "{\"type\":200,\"ssrc\":1814766290,\"report_count\":0,\"report_blocks\":[],\"sender_information\":{\"packets\":2,\"ntp_timestamp_sec\":\"3373905459\",\"ntp_timestamp_usec\":\"4280379832\",\"rtp_timestamp\":-210833031,\"octets\":40}} ",
        "tsNs": "1718031813885000000",
        "id": "1718031813885000000_e209a8b",
        "traceId": null,
        "traceID": null,
        "callid": null,
        "correlationId": null
    },
    {
        "labels": {
            "callid": "b7jl7s@127.0.0.1",
            "dst_ip": "8.76.6.57",
            "dst_port": "5064",
            "hostname": "b6f17faf8431",
            "job": "heplify-server",
            "method": "INVITE",
            "node": "2001",
            "response": "407",
            "src_ip": "17.103.77.199",
            "src_port": "5060",
            "type": "sip",
            "timestamp": 1718031804118
        },
        "Time": 1718031804118,
        "Line": "SIP/2.0 407 Proxy Authentication Required\r\nVia: SIP/2.0/UDP 192.168.10.129:5064;received=8.76.6.57;branch=z9hG4bK923381359;rport=5064\r\nFrom: <sip:hepgenjs@sipcapture.org;user=phone>;tag=415746302\r\nTo: <sip:123@sipcapture.org;user=phone>;tag=1d24a28a0bded6c40d31e6db8aab9ac6.0385\r\nCall-ID: b7jl7s@127.0.0.1\r\nCSeq: 440 INVITE\r\nProxy-Authenticate: Digest realm=\"sipcapture.org\", nonce=\"VuRZ5VbkWLkkVKJ9B1rBIN9Q3nRbqc9z\"\r\nServer: SIP Proxy\r\nContent-Length: 0\r\n\r\n\r\n",
        "tsNs": "1718031804118000000",
        "id": "1718031804118000000_3ab4c30",
        "traceId": null,
        "traceID": null,
        "callid": "b7jl7s@127.0.0.1",
        "correlationId": null
    },
    {
        "labels": {
            "callid": "b7jl7s@127.0.0.1",
            "dst_ip": "8.76.6.57",
            "dst_port": "5064",
            "hostname": "b6f17faf8431",
            "job": "heplify-server",
            "method": "INVITE",
            "node": "2001",
            "response": "200",
            "src_ip": "17.103.77.199",
            "src_port": "5060",
            "type": "sip",
            "timestamp": 1718031807868
        },
        "Time": 1718031807868,
        "Line": "SIP/2.0 200 OK\r\nRecord-Route: <sip:127.0.0.1:5062;lr=on;ftag=415746302;did=d5d.c191;mpd=ii;ice_caller=strip;ice_callee=strip;rtpprx=yes;vsf=YlB4MwAQcRpkPgIJNBwOYAhoe188D24/UEcsTigdagkbLCgy>\r\nRecord-Route: <sip:127.0.0.1;r2=on;lr=on;ftag=415746302;nat=yes;lb=yes;socket=udp:17.103.77.199:5060>\r\nRecord-Route: <sip:17.103.77.199;r2=on;lr=on;ftag=415746302;nat=yes;lb=yes;socket=udp:17.103.77.199:5060>\r\nVia: SIP/2.0/UDP 192.168.10.129:5064;received=8.76.6.57;branch=z9hG4bK104237110;rport=5064\r\nFrom: <sip:hepgenjs@sipcapture.org;user=phone>;tag=415746302\r\nTo: <sip:123@sipcapture.org;user=phone>;tag=7DB80AAE-56E458BB0008256B-B7852700\r\nCall-ID: b7jl7s@127.0.0.1\r\nCSeq: 441 INVITE\r\nUser-Agent: HEPeer\r\nAllow: INVITE, ACK, CANCEL, OPTIONS, BYE, REFER, SUBSCRIBE, NOTIFY\r\nSupported: replaces\r\nContent-Type: application/sdp\r\nContent-Length: 329\r\nContact: <sip:lb@17.103.77.199:5060;ngcpct=c2lwOjEyNy4wLjAuMTo1MDgw>\r\n\r\nv=0\r\no=root 11882 11882 IN IP4 17.103.77.199\r\ns=session\r\nc=IN IP4 17.103.77.199\r\nt=0 0\r\nm=audio 31956 RTP/AVP 8 0 18 101\r\na=rtpmap:8 PCMA/8000\r\na=rtpmap:0 PCMU/8000\r\na=rtpmap:18 G729/8000\r\na=fmtp:18 annexb=no\r\na=rtpmap:101 telephone-event/8000\r\na=fmtp:101 0-16\r\na=silenceSupp:off - - - -\r\na=ptime:20\r\na=sendrecv\r\na=rtcp:31957\r\n\r\n\r\n",
        "tsNs": "1718031807868000000",
        "id": "1718031807868000000_fb459212",
        "traceId": null,
        "traceID": null,
        "callid": "b7jl7s@127.0.0.1",
        "correlationId": null
    },
    {
        "labels": {
            "callid": "b7jl7s@127.0.0.1",
            "dst_ip": "8.76.6.57",
            "dst_port": "5064",
            "hostname": "b6f17faf8431",
            "job": "heplify-server",
            "method": "INVITE",
            "node": "2001",
            "response": "100",
            "src_ip": "17.103.77.199",
            "src_port": "5060",
            "type": "sip",
            "timestamp": 1718031805368
        },
        "Time": 1718031805368,
        "Line": "SIP/2.0 100 Trying\r\nVia: SIP/2.0/UDP 192.168.10.129:5064;received=8.76.6.57;branch=z9hG4bK104237110;rport=5064\r\nFrom: <sip:hepgenjs@sipcapture.org;user=phone>;tag=415746302\r\nTo: <sip:123@sipcapture.org;user=phone>\r\nCall-ID: b7jl7s@127.0.0.1\r\nCSeq: 441 INVITE\r\nServer: SIP Proxy\r\nContent-Length: 0\r\n\r\n\r\n",
        "tsNs": "1718031805368000000",
        "id": "1718031805368000000_be944f35",
        "traceId": null,
        "traceID": null,
        "callid": "b7jl7s@127.0.0.1",
        "correlationId": null
    }
]

export const sampleDataAfterBaseFilter = {
    "actors": [],
    "data": [
        {
            "messageID": "b7jl7s@127.0.0.1:sip",
            "details": "15:03:24.118",
            "line": "",
            "source": "17.103.77.199:5060",
            "destination": "8.76.6.57:5064",
            "title": "407:sip",
            "aboveArrow": "b6f17faf8431",
            "belowArrow": "2001",
            "sourceLabel": "5060",
            "destinationLabel": "5064",
            "hidden": false,
            "hash": "d703aba8c1eed3613e4bf0fb1685a58c"
        },
        {
            "messageID": "b7jl7s@127.0.0.1:sip",
            "details": "15:03:25.368",
            "line": "",
            "source": "17.103.77.199:5060",
            "destination": "8.76.6.57:5064",
            "title": "100:sip",
            "aboveArrow": "b6f17faf8431",
            "belowArrow": "2001",
            "sourceLabel": "5060",
            "destinationLabel": "5064",
            "hidden": false,
            "hash": "6e5f1e64214e9402c85f6f53c59542c9"
        },
        {
            "messageID": "b7jl7s@127.0.0.1:sip",
            "details": "15:03:27.868",
            "line": "",
            "source": "17.103.77.199:5060",
            "destination": "8.76.6.57:5064",
            "title": "200:sip",
            "aboveArrow": "b6f17faf8431",
            "belowArrow": "2001",
            "sourceLabel": "5060",
            "destinationLabel": "5064",
            "hidden": false,
            "hash": "87339623b1626503bf9ccd31dba14d1a"
        },
        {
            "messageID": "plwj7a@127.0.0.1_b2b-1:sip",
            "details": "15:03:33.685",
            "line": "",
            "source": "216.187.19.159:5060",
            "destination": "93.172.7.63:5060",
            "title": "ACK:sip",
            "aboveArrow": "b6f17faf8431",
            "belowArrow": "2001",
            "sourceLabel": "5060",
            "destinationLabel": "5060",
            "hidden": false,
            "hash": "73625b6c3c4de7b01ad4bc7ddb682629"
        },
        {
            "messageID": "rtcp",
            "details": "15:03:33.885",
            "line": "",
            "source": "216.187.19.159:0",
            "destination": "93.172.7.63:0",
            "title": "rtcp",
            "aboveArrow": "b6f17faf8431",
            "belowArrow": "2001",
            "sourceLabel": "0",
            "destinationLabel": "0",
            "hidden": false,
            "hash": "b47370f92c22ead6f52099cc0c1187fc"
        }
    ]
}
export const sampleDataAfterFilterWithoutRTCP = {
    "actors": [],
    "data": [
        {
            "messageID": "b7jl7s@127.0.0.1:sip",
            "details": "15:03:24.118",
            "line": "",
            "source": "17.103.77.199:5060",
            "destination": "8.76.6.57:5064",
            "title": "407:sip",
            "aboveArrow": "b6f17faf8431",
            "belowArrow": "2001",
            "sourceLabel": "5060",
            "destinationLabel": "5064",
            "hidden": false,
            "hash": "d703aba8c1eed3613e4bf0fb1685a58c"
        },
        {
            "messageID": "b7jl7s@127.0.0.1:sip",
            "details": "15:03:25.368",
            "line": "",
            "source": "17.103.77.199:5060",
            "destination": "8.76.6.57:5064",
            "title": "100:sip",
            "aboveArrow": "b6f17faf8431",
            "belowArrow": "2001",
            "sourceLabel": "5060",
            "destinationLabel": "5064",
            "hidden": false,
            "hash": "6e5f1e64214e9402c85f6f53c59542c9"
        },
        {
            "messageID": "b7jl7s@127.0.0.1:sip",
            "details": "15:03:27.868",
            "line": "",
            "source": "17.103.77.199:5060",
            "destination": "8.76.6.57:5064",
            "title": "200:sip",
            "aboveArrow": "b6f17faf8431",
            "belowArrow": "2001",
            "sourceLabel": "5060",
            "destinationLabel": "5064",
            "hidden": false,
            "hash": "87339623b1626503bf9ccd31dba14d1a"
        },
        {
            "messageID": "plwj7a@127.0.0.1_b2b-1:sip",
            "details": "15:03:33.685",
            "line": "",
            "source": "216.187.19.159:5060",
            "destination": "93.172.7.63:5060",
            "title": "ACK:sip",
            "aboveArrow": "b6f17faf8431",
            "belowArrow": "2001",
            "sourceLabel": "5060",
            "destinationLabel": "5060",
            "hidden": false,
            "hash": "73625b6c3c4de7b01ad4bc7ddb682629"
        }
    ]
}
