--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: audits; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.audits (
    id character varying(26) NOT NULL,
    createat bigint,
    userid character varying(26),
    action character varying(512),
    extrainfo character varying(1024),
    ipaddress character varying(64),
    sessionid character varying(26)
);


ALTER TABLE public.audits OWNER TO mmuser;

--
-- Name: bots; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.bots (
    userid character varying(26) NOT NULL,
    description character varying(1024),
    ownerid character varying(190),
    lasticonupdate bigint,
    createat bigint,
    updateat bigint,
    deleteat bigint
);


ALTER TABLE public.bots OWNER TO mmuser;

--
-- Name: channelmemberhistory; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.channelmemberhistory (
    channelid character varying(26) NOT NULL,
    userid character varying(26) NOT NULL,
    jointime bigint NOT NULL,
    leavetime bigint
);


ALTER TABLE public.channelmemberhistory OWNER TO mmuser;

--
-- Name: channelmembers; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.channelmembers (
    channelid character varying(26) NOT NULL,
    userid character varying(26) NOT NULL,
    roles character varying(64),
    lastviewedat bigint,
    msgcount bigint,
    mentioncount bigint,
    notifyprops character varying(2000),
    lastupdateat bigint,
    schemeuser boolean,
    schemeadmin boolean,
    schemeguest boolean
);


ALTER TABLE public.channelmembers OWNER TO mmuser;

--
-- Name: channels; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.channels (
    id character varying(26) NOT NULL,
    createat bigint,
    updateat bigint,
    deleteat bigint,
    teamid character varying(26),
    type character varying(1),
    displayname character varying(64),
    name character varying(64),
    header character varying(1024),
    purpose character varying(250),
    lastpostat bigint,
    totalmsgcount bigint,
    extraupdateat bigint,
    creatorid character varying(26),
    schemeid character varying(26),
    groupconstrained boolean
);


ALTER TABLE public.channels OWNER TO mmuser;

--
-- Name: clusterdiscovery; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.clusterdiscovery (
    id character varying(26) NOT NULL,
    type character varying(64),
    clustername character varying(64),
    hostname character varying(512),
    gossipport integer,
    port integer,
    createat bigint,
    lastpingat bigint
);


ALTER TABLE public.clusterdiscovery OWNER TO mmuser;

--
-- Name: commands; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.commands (
    id character varying(26) NOT NULL,
    token character varying(26),
    createat bigint,
    updateat bigint,
    deleteat bigint,
    creatorid character varying(26),
    teamid character varying(26),
    trigger character varying(128),
    method character varying(1),
    username character varying(64),
    iconurl character varying(1024),
    autocomplete boolean,
    autocompletedesc character varying(1024),
    autocompletehint character varying(1024),
    displayname character varying(64),
    description character varying(128),
    url character varying(1024)
);


ALTER TABLE public.commands OWNER TO mmuser;

--
-- Name: commandwebhooks; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.commandwebhooks (
    id character varying(26) NOT NULL,
    createat bigint,
    commandid character varying(26),
    userid character varying(26),
    channelid character varying(26),
    rootid character varying(26),
    parentid character varying(26),
    usecount integer
);


ALTER TABLE public.commandwebhooks OWNER TO mmuser;

--
-- Name: compliances; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.compliances (
    id character varying(26) NOT NULL,
    createat bigint,
    userid character varying(26),
    status character varying(64),
    count integer,
    "desc" character varying(512),
    type character varying(64),
    startat bigint,
    endat bigint,
    keywords character varying(512),
    emails character varying(1024)
);


ALTER TABLE public.compliances OWNER TO mmuser;

--
-- Name: emoji; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.emoji (
    id character varying(26) NOT NULL,
    createat bigint,
    updateat bigint,
    deleteat bigint,
    creatorid character varying(26),
    name character varying(64)
);


ALTER TABLE public.emoji OWNER TO mmuser;

--
-- Name: fileinfo; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.fileinfo (
    id character varying(26) NOT NULL,
    creatorid character varying(26),
    postid character varying(26),
    createat bigint,
    updateat bigint,
    deleteat bigint,
    path character varying(512),
    thumbnailpath character varying(512),
    previewpath character varying(512),
    name character varying(256),
    extension character varying(64),
    size bigint,
    mimetype character varying(256),
    width integer,
    height integer,
    haspreviewimage boolean
);


ALTER TABLE public.fileinfo OWNER TO mmuser;

--
-- Name: groupchannels; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.groupchannels (
    groupid character varying(26) NOT NULL,
    autoadd boolean,
    schemeadmin boolean,
    createat bigint,
    deleteat bigint,
    updateat bigint,
    channelid character varying(26) NOT NULL
);


ALTER TABLE public.groupchannels OWNER TO mmuser;

--
-- Name: groupmembers; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.groupmembers (
    groupid character varying(26) NOT NULL,
    userid character varying(26) NOT NULL,
    createat bigint,
    deleteat bigint
);


ALTER TABLE public.groupmembers OWNER TO mmuser;

--
-- Name: groupteams; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.groupteams (
    groupid character varying(26) NOT NULL,
    autoadd boolean,
    schemeadmin boolean,
    createat bigint,
    deleteat bigint,
    updateat bigint,
    teamid character varying(26) NOT NULL
);


ALTER TABLE public.groupteams OWNER TO mmuser;

--
-- Name: incomingwebhooks; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.incomingwebhooks (
    id character varying(26) NOT NULL,
    createat bigint,
    updateat bigint,
    deleteat bigint,
    userid character varying(26),
    channelid character varying(26),
    teamid character varying(26),
    displayname character varying(64),
    description character varying(500),
    username text,
    iconurl text,
    channellocked boolean
);


ALTER TABLE public.incomingwebhooks OWNER TO mmuser;

--
-- Name: jobs; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.jobs (
    id character varying(26) NOT NULL,
    type character varying(32),
    priority bigint,
    createat bigint,
    startat bigint,
    lastactivityat bigint,
    status character varying(32),
    progress bigint,
    data character varying(1024)
);


ALTER TABLE public.jobs OWNER TO mmuser;

--
-- Name: licenses; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.licenses (
    id character varying(26) NOT NULL,
    createat bigint,
    bytes character varying(10000)
);


ALTER TABLE public.licenses OWNER TO mmuser;

--
-- Name: linkmetadata; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.linkmetadata (
    hash bigint NOT NULL,
    url character varying(2048),
    "timestamp" bigint,
    type character varying(16),
    data character varying(4096)
);


ALTER TABLE public.linkmetadata OWNER TO mmuser;

--
-- Name: oauthaccessdata; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.oauthaccessdata (
    clientid character varying(26),
    userid character varying(26),
    token character varying(26) NOT NULL,
    refreshtoken character varying(26),
    redirecturi character varying(256),
    expiresat bigint,
    scope character varying(128)
);


ALTER TABLE public.oauthaccessdata OWNER TO mmuser;

--
-- Name: oauthapps; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.oauthapps (
    id character varying(26) NOT NULL,
    creatorid character varying(26),
    createat bigint,
    updateat bigint,
    clientsecret character varying(128),
    name character varying(64),
    description character varying(512),
    iconurl character varying(512),
    callbackurls character varying(1024),
    homepage character varying(256),
    istrusted boolean
);


ALTER TABLE public.oauthapps OWNER TO mmuser;

--
-- Name: oauthauthdata; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.oauthauthdata (
    clientid character varying(26),
    userid character varying(26),
    code character varying(128) NOT NULL,
    expiresin integer,
    createat bigint,
    redirecturi character varying(256),
    state character varying(1024),
    scope character varying(128)
);


ALTER TABLE public.oauthauthdata OWNER TO mmuser;

--
-- Name: outgoingwebhooks; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.outgoingwebhooks (
    id character varying(26) NOT NULL,
    token character varying(26),
    createat bigint,
    updateat bigint,
    deleteat bigint,
    creatorid character varying(26),
    channelid character varying(26),
    teamid character varying(26),
    triggerwords character varying(1024),
    triggerwhen integer,
    callbackurls character varying(1024),
    displayname character varying(64),
    description character varying(500),
    contenttype character varying(128),
    username character varying(64),
    iconurl character varying(1024)
);


ALTER TABLE public.outgoingwebhooks OWNER TO mmuser;

--
-- Name: pluginkeyvaluestore; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.pluginkeyvaluestore (
    pluginid character varying(190) NOT NULL,
    pkey character varying(50) NOT NULL,
    pvalue bytea,
    expireat bigint
);


ALTER TABLE public.pluginkeyvaluestore OWNER TO mmuser;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.posts (
    id character varying(26) NOT NULL,
    createat bigint,
    updateat bigint,
    editat bigint,
    deleteat bigint,
    ispinned boolean,
    userid character varying(26),
    channelid character varying(26),
    rootid character varying(26),
    parentid character varying(26),
    originalid character varying(26),
    message character varying(65535),
    type character varying(26),
    props character varying(8000),
    hashtags character varying(1000),
    filenames character varying(4000),
    fileids character varying(150),
    hasreactions boolean
);


ALTER TABLE public.posts OWNER TO mmuser;

--
-- Name: preferences; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.preferences (
    userid character varying(26) NOT NULL,
    category character varying(32) NOT NULL,
    name character varying(32) NOT NULL,
    value character varying(2000)
);


ALTER TABLE public.preferences OWNER TO mmuser;

--
-- Name: publicchannels; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.publicchannels (
    id character varying(26) NOT NULL,
    deleteat bigint,
    teamid character varying(26),
    displayname character varying(64),
    name character varying(64),
    header character varying(1024),
    purpose character varying(250)
);


ALTER TABLE public.publicchannels OWNER TO mmuser;

--
-- Name: reactions; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.reactions (
    userid character varying(26) NOT NULL,
    postid character varying(26) NOT NULL,
    emojiname character varying(64) NOT NULL,
    createat bigint
);


ALTER TABLE public.reactions OWNER TO mmuser;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.roles (
    id character varying(26) NOT NULL,
    name character varying(64),
    displayname character varying(128),
    description character varying(1024),
    createat bigint,
    updateat bigint,
    deleteat bigint,
    permissions character varying(4096),
    schememanaged boolean,
    builtin boolean
);


ALTER TABLE public.roles OWNER TO mmuser;

--
-- Name: schemes; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.schemes (
    id character varying(26) NOT NULL,
    name character varying(64),
    displayname character varying(128),
    description character varying(1024),
    createat bigint,
    updateat bigint,
    deleteat bigint,
    scope character varying(32),
    defaultteamadminrole character varying(64),
    defaultteamuserrole character varying(64),
    defaultchanneladminrole character varying(64),
    defaultchanneluserrole character varying(64),
    defaultteamguestrole character varying(64),
    defaultchannelguestrole character varying(64)
);


ALTER TABLE public.schemes OWNER TO mmuser;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.sessions (
    id character varying(26) NOT NULL,
    token character varying(26),
    createat bigint,
    expiresat bigint,
    lastactivityat bigint,
    userid character varying(26),
    deviceid character varying(512),
    roles character varying(64),
    isoauth boolean,
    props character varying(1000)
);


ALTER TABLE public.sessions OWNER TO mmuser;

--
-- Name: status; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.status (
    userid character varying(26) NOT NULL,
    status character varying(32),
    manual boolean,
    lastactivityat bigint
);


ALTER TABLE public.status OWNER TO mmuser;

--
-- Name: systems; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.systems (
    name character varying(64) NOT NULL,
    value character varying(1024)
);


ALTER TABLE public.systems OWNER TO mmuser;

--
-- Name: teammembers; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.teammembers (
    teamid character varying(26) NOT NULL,
    userid character varying(26) NOT NULL,
    roles character varying(64),
    deleteat bigint,
    schemeuser boolean,
    schemeadmin boolean,
    schemeguest boolean
);


ALTER TABLE public.teammembers OWNER TO mmuser;

--
-- Name: teams; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.teams (
    id character varying(26) NOT NULL,
    createat bigint,
    updateat bigint,
    deleteat bigint,
    displayname character varying(64),
    name character varying(64),
    description character varying(255),
    email character varying(128),
    type text,
    companyname character varying(64),
    alloweddomains character varying(1000),
    inviteid character varying(32),
    allowopeninvite boolean,
    lastteamiconupdate bigint,
    schemeid text,
    groupconstrained boolean
);


ALTER TABLE public.teams OWNER TO mmuser;

--
-- Name: termsofservice; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.termsofservice (
    id character varying(26) NOT NULL,
    createat bigint,
    userid character varying(26),
    text character varying(65535)
);


ALTER TABLE public.termsofservice OWNER TO mmuser;

--
-- Name: tokens; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.tokens (
    token character varying(64) NOT NULL,
    createat bigint,
    type character varying(64),
    extra character varying(2048)
);


ALTER TABLE public.tokens OWNER TO mmuser;

--
-- Name: useraccesstokens; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.useraccesstokens (
    id character varying(26) NOT NULL,
    token character varying(26),
    userid character varying(26),
    description character varying(512),
    isactive boolean
);


ALTER TABLE public.useraccesstokens OWNER TO mmuser;

--
-- Name: usergroups; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.usergroups (
    id character varying(26) NOT NULL,
    name character varying(64),
    displayname character varying(128),
    description character varying(1024),
    source character varying(64),
    remoteid character varying(48),
    createat bigint,
    updateat bigint,
    deleteat bigint,
    allowreference boolean
);


ALTER TABLE public.usergroups OWNER TO mmuser;

--
-- Name: users; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.users (
    id character varying(26) NOT NULL,
    createat bigint,
    updateat bigint,
    deleteat bigint,
    username character varying(64),
    password character varying(128),
    authdata character varying(128),
    authservice character varying(32),
    email character varying(128),
    emailverified boolean,
    nickname character varying(64),
    firstname character varying(64),
    lastname character varying(64),
    "position" character varying(128),
    roles character varying(256),
    allowmarketing boolean,
    props character varying(4000),
    notifyprops character varying(2000),
    lastpasswordupdate bigint,
    lastpictureupdate bigint,
    failedattempts integer,
    locale character varying(5),
    timezone character varying(256),
    mfaactive boolean,
    mfasecret character varying(128)
);


ALTER TABLE public.users OWNER TO mmuser;

--
-- Name: usertermsofservice; Type: TABLE; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE TABLE public.usertermsofservice (
    userid character varying(26) NOT NULL,
    termsofserviceid character varying(26),
    createat bigint
);


ALTER TABLE public.usertermsofservice OWNER TO mmuser;

--
-- Data for Name: audits; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.audits (id, createat, userid, action, extrainfo, ipaddress, sessionid) FROM stdin;
hphsnrhssibt9f7edfxeoaufma	1591494272156	gr8a7ec9gtnkikk9n5u8rjecca	/api/v4/users/login	attempt - login_id=	::1	
un3oycw1hi867j58qg986hy13r	1591494272232	gr8a7ec9gtnkikk9n5u8rjecca	/api/v4/users/login	authenticated	::1	
jzbbyn73b78zdkse3971jur91h	1591494272242	gr8a7ec9gtnkikk9n5u8rjecca	/api/v4/users/login	success session_user=gr8a7ec9gtnkikk9n5u8rjecca	::1	hgi3bdpbkp8npxt769x7eoebro
rizcc7ztttyu7rnbkhwcbijf1c	1591494292787	gr8a7ec9gtnkikk9n5u8rjecca	/api/v4/users/me/patch		::1	hgi3bdpbkp8npxt769x7eoebro
\.


--
-- Data for Name: bots; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.bots (userid, description, ownerid, lasticonupdate, createat, updateat, deleteat) FROM stdin;
\.


--
-- Data for Name: channelmemberhistory; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.channelmemberhistory (channelid, userid, jointime, leavetime) FROM stdin;
oucy9sd1kbdxxqxoj1wgaoa3oe	gr8a7ec9gtnkikk9n5u8rjecca	1591494282634	\N
npurg3omrjgw8ek5gwya5qfdoa	gr8a7ec9gtnkikk9n5u8rjecca	1591494282701	\N
\.


--
-- Data for Name: channelmembers; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.channelmembers (channelid, userid, roles, lastviewedat, msgcount, mentioncount, notifyprops, lastupdateat, schemeuser, schemeadmin, schemeguest) FROM stdin;
npurg3omrjgw8ek5gwya5qfdoa	gr8a7ec9gtnkikk9n5u8rjecca		0	0	0	{"desktop":"default","email":"default","ignore_channel_mentions":"default","mark_unread":"all","push":"default"}	1591494282677	t	t	f
oucy9sd1kbdxxqxoj1wgaoa3oe	gr8a7ec9gtnkikk9n5u8rjecca		1591494282638	0	0	{"desktop":"default","email":"default","ignore_channel_mentions":"default","mark_unread":"all","push":"default"}	1591494282638	t	t	f
\.


--
-- Data for Name: channels; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.channels (id, createat, updateat, deleteat, teamid, type, displayname, name, header, purpose, lastpostat, totalmsgcount, extraupdateat, creatorid, schemeid, groupconstrained) FROM stdin;
oucy9sd1kbdxxqxoj1wgaoa3oe	1591494282544	1591494282544	0	msexnx44xpfaxey74t7dikpm3h	O	Town Square	town-square			1591494282638	0	0		\N	\N
npurg3omrjgw8ek5gwya5qfdoa	1591494282569	1591494282569	0	msexnx44xpfaxey74t7dikpm3h	O	Off-Topic	off-topic			1591494282705	0	0		\N	\N
\.


--
-- Data for Name: clusterdiscovery; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.clusterdiscovery (id, type, clustername, hostname, gossipport, port, createat, lastpingat) FROM stdin;
\.


--
-- Data for Name: commands; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.commands (id, token, createat, updateat, deleteat, creatorid, teamid, trigger, method, username, iconurl, autocomplete, autocompletedesc, autocompletehint, displayname, description, url) FROM stdin;
\.


--
-- Data for Name: commandwebhooks; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.commandwebhooks (id, createat, commandid, userid, channelid, rootid, parentid, usecount) FROM stdin;
\.


--
-- Data for Name: compliances; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.compliances (id, createat, userid, status, count, "desc", type, startat, endat, keywords, emails) FROM stdin;
\.


--
-- Data for Name: emoji; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.emoji (id, createat, updateat, deleteat, creatorid, name) FROM stdin;
\.


--
-- Data for Name: fileinfo; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.fileinfo (id, creatorid, postid, createat, updateat, deleteat, path, thumbnailpath, previewpath, name, extension, size, mimetype, width, height, haspreviewimage) FROM stdin;
\.


--
-- Data for Name: groupchannels; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.groupchannels (groupid, autoadd, schemeadmin, createat, deleteat, updateat, channelid) FROM stdin;
\.


--
-- Data for Name: groupmembers; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.groupmembers (groupid, userid, createat, deleteat) FROM stdin;
\.


--
-- Data for Name: groupteams; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.groupteams (groupid, autoadd, schemeadmin, createat, deleteat, updateat, teamid) FROM stdin;
\.


--
-- Data for Name: incomingwebhooks; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.incomingwebhooks (id, createat, updateat, deleteat, userid, channelid, teamid, displayname, description, username, iconurl, channellocked) FROM stdin;
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.jobs (id, type, priority, createat, startat, lastactivityat, status, progress, data) FROM stdin;
dy63uoyio7fcpqqojbye6nxagy	migrations	0	1591494283833	1591494295245	1591494295734	success	0	{"last_done":"{\\"current_table\\":\\"ChannelMembers\\",\\"last_team_id\\":\\"msexnx44xpfaxey74t7dikpm3h\\",\\"last_channel_id\\":\\"oucy9sd1kbdxxqxoj1wgaoa3oe\\",\\"last_user\\":\\"gr8a7ec9gtnkikk9n5u8rjecca\\"}","migration_key":"migration_advanced_permissions_phase_2"}
\.


--
-- Data for Name: licenses; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.licenses (id, createat, bytes) FROM stdin;
\.


--
-- Data for Name: linkmetadata; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.linkmetadata (hash, url, "timestamp", type, data) FROM stdin;
\.


--
-- Data for Name: oauthaccessdata; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.oauthaccessdata (clientid, userid, token, refreshtoken, redirecturi, expiresat, scope) FROM stdin;
\.


--
-- Data for Name: oauthapps; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.oauthapps (id, creatorid, createat, updateat, clientsecret, name, description, iconurl, callbackurls, homepage, istrusted) FROM stdin;
\.


--
-- Data for Name: oauthauthdata; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.oauthauthdata (clientid, userid, code, expiresin, createat, redirecturi, state, scope) FROM stdin;
\.


--
-- Data for Name: outgoingwebhooks; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.outgoingwebhooks (id, token, createat, updateat, deleteat, creatorid, channelid, teamid, triggerwords, triggerwhen, callbackurls, displayname, description, contenttype, username, iconurl) FROM stdin;
\.


--
-- Data for Name: pluginkeyvaluestore; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.pluginkeyvaluestore (pluginid, pkey, pvalue, expireat) FROM stdin;
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.posts (id, createat, updateat, editat, deleteat, ispinned, userid, channelid, rootid, parentid, originalid, message, type, props, hashtags, filenames, fileids, hasreactions) FROM stdin;
69r84y74digrzda1gq4595q8qa	1591494282638	1591494282638	0	0	f	gr8a7ec9gtnkikk9n5u8rjecca	oucy9sd1kbdxxqxoj1wgaoa3oe				sysadmin joined the team.	system_join_team	{"username":"sysadmin"}		[]	[]	f
g59g8wirpp88if4i133kk3kdqc	1591494282705	1591494282705	0	0	f	gr8a7ec9gtnkikk9n5u8rjecca	npurg3omrjgw8ek5gwya5qfdoa				sysadmin joined the channel.	system_join_channel	{"username":"sysadmin"}		[]	[]	f
\.


--
-- Data for Name: preferences; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.preferences (userid, category, name, value) FROM stdin;
gr8a7ec9gtnkikk9n5u8rjecca	tutorial_step	gr8a7ec9gtnkikk9n5u8rjecca	999
gr8a7ec9gtnkikk9n5u8rjecca	channel_approximate_view_time		1591494295214
\.


--
-- Data for Name: publicchannels; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.publicchannels (id, deleteat, teamid, displayname, name, header, purpose) FROM stdin;
oucy9sd1kbdxxqxoj1wgaoa3oe	0	msexnx44xpfaxey74t7dikpm3h	Town Square	town-square		
npurg3omrjgw8ek5gwya5qfdoa	0	msexnx44xpfaxey74t7dikpm3h	Off-Topic	off-topic		
\.


--
-- Data for Name: reactions; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.reactions (userid, postid, emojiname, createat) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.roles (id, name, displayname, description, createat, updateat, deleteat, permissions, schememanaged, builtin) FROM stdin;
md7hbsx11bbnxni379c4m9jfzr	channel_user	authentication.roles.channel_user.name	authentication.roles.channel_user.description	1591494223013	1591494223666	0	 delete_private_channel remove_reaction get_public_link manage_private_channel_members edit_post manage_private_channel_properties read_channel use_slash_commands manage_public_channel_properties create_post manage_public_channel_members use_channel_mentions upload_file add_reaction use_group_mentions delete_public_channel delete_post	t	t
cp5zajn9dibd8gdsdtrjz9m3ce	system_post_all_public	authentication.roles.system_post_all_public.name	authentication.roles.system_post_all_public.description	1591494223046	1591494223669	0	 create_post_public use_channel_mentions use_group_mentions	f	t
sdkyhoq49tb5pg38nkyh7fy1se	system_user	authentication.roles.global_user.name	authentication.roles.global_user.description	1591494222984	1591494223672	0	 join_public_teams create_direct_channel create_group_channel view_members create_team create_emojis delete_emojis list_public_teams	t	t
um1jetytkpn1dpgmx5j8zt449w	system_post_all	authentication.roles.system_post_all.name	authentication.roles.system_post_all.description	1591494223018	1591494223675	0	 create_post use_channel_mentions use_group_mentions	f	t
cx7r4am9j3gmzk7u8fak3fmc1y	team_user	authentication.roles.team_user.name	authentication.roles.team_user.description	1591494222973	1591494223677	0	 invite_user add_user_to_team list_team_channels join_public_channels read_public_channel view_team create_public_channel create_private_channel	t	t
ap6pj16tz7yixxbsgj3ohoo9pc	team_admin	authentication.roles.team_admin.name	authentication.roles.team_admin.description	1591494222979	1591494223679	0	 use_channel_mentions manage_team remove_reaction import_team delete_others_posts manage_channel_roles manage_incoming_webhooks manage_public_channel_members manage_others_slash_commands add_reaction manage_outgoing_webhooks manage_slash_commands delete_post remove_user_from_team use_group_mentions manage_team_roles manage_others_outgoing_webhooks manage_private_channel_members manage_others_incoming_webhooks create_post	t	t
fzyqxjd8bjr3fxz7d7oxjwqyzw	system_user_access_token	authentication.roles.system_user_access_token.name	authentication.roles.system_user_access_token.description	1591494223024	1591494223648	0	 read_user_access_token revoke_user_access_token create_user_access_token	f	t
a3rx17wfr3nw3po1xd47d5dd4y	team_guest	authentication.roles.team_guest.name	authentication.roles.team_guest.description	1591494223030	1591494223651	0	 view_team	t	t
zmicw6ba1byc5koi5gn4qqwr3e	team_post_all_public	authentication.roles.team_post_all_public.name	authentication.roles.team_post_all_public.description	1591494223035	1591494223654	0	 use_channel_mentions create_post_public use_group_mentions	f	t
ytkb5grki3fqupbadbjz6e4w9h	system_guest	authentication.roles.global_guest.name	authentication.roles.global_guest.description	1591494223041	1591494223657	0	 create_group_channel create_direct_channel	t	t
qbsghimz3pnuue6ya6hyfjjzwh	channel_guest	authentication.roles.channel_guest.name	authentication.roles.channel_guest.description	1591494222990	1591494223660	0	 use_slash_commands read_channel add_reaction remove_reaction upload_file edit_post create_post use_channel_mentions	t	t
3zuchx55ginfzy5qbobu78d7ao	channel_admin	authentication.roles.channel_admin.name	authentication.roles.channel_admin.description	1591494222995	1591494223662	0	 manage_channel_roles create_post add_reaction remove_reaction manage_public_channel_members manage_private_channel_members use_channel_mentions use_group_mentions	t	t
yjfhrcne6jd198h11xbrc47eko	team_post_all	authentication.roles.team_post_all.name	authentication.roles.team_post_all.description	1591494223000	1591494223664	0	 create_post use_group_mentions use_channel_mentions	f	t
guweab8f5pbpxgfywqp9t9mcto	system_admin	authentication.roles.global_admin.name	authentication.roles.global_admin.description	1591494223006	1591494223681	0	 create_public_channel remove_others_reactions list_private_teams manage_public_channel_members create_private_channel manage_incoming_webhooks create_post read_public_channel manage_others_bots demote_to_guest invite_user create_post_ephemeral manage_system create_bot manage_others_incoming_webhooks create_team read_others_bots delete_public_channel manage_private_channel_properties delete_post delete_others_emojis manage_others_outgoing_webhooks read_channel edit_other_users delete_emojis create_post_public manage_team_roles manage_others_slash_commands invite_guest import_team assign_system_admin_role delete_private_channel join_private_teams revoke_user_access_token manage_slash_commands delete_others_posts remove_reaction manage_public_channel_properties manage_oauth view_team add_reaction manage_team manage_jobs use_group_mentions manage_private_channel_members use_slash_commands manage_system_wide_oauth add_user_to_team manage_channel_roles view_members manage_outgoing_webhooks join_public_channels read_user_access_token create_user_access_token use_channel_mentions promote_guest edit_post get_public_link remove_user_from_team create_emojis read_bots manage_bots list_team_channels upload_file manage_roles list_users_without_team edit_others_posts	t	t
\.


--
-- Data for Name: schemes; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.schemes (id, name, displayname, description, createat, updateat, deleteat, scope, defaultteamadminrole, defaultteamuserrole, defaultchanneladminrole, defaultchanneluserrole, defaultteamguestrole, defaultchannelguestrole) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.sessions (id, token, createat, expiresat, lastactivityat, userid, deviceid, roles, isoauth, props) FROM stdin;
hgi3bdpbkp8npxt769x7eoebro	6w9gg3mkejfhde6m4j45h6iyiy	1591494272235	1594086272235	1591494272235	gr8a7ec9gtnkikk9n5u8rjecca		system_admin system_user	f	{"browser":"Chrome/83.0.4103","csrf":"xiw9mhtj7j85dr4dfweasigihy","is_guest":"false","os":"Mac OS","platform":"Macintosh"}
\.


--
-- Data for Name: status; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.status (userid, status, manual, lastactivityat) FROM stdin;
gr8a7ec9gtnkikk9n5u8rjecca	online	f	1591494282848
\.


--
-- Data for Name: systems; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.systems (name, value) FROM stdin;
Version	5.26.0
AsymmetricSigningKey	{"ecdsa_key":{"curve":"P-256","x":70231021557114761676318437905103986585533707946332079247898504976323079478105,"y":114686463533349728783729751945146210154375680772119596658561867028623036666105,"d":1950464928417319753323956232940572210318389413489157502932881377530603411891}}
PostActionCookieSecret	{"key":"edzNTbc7BjoX9EaXSG2dB2U4DLj3qrmsWOlDsZao4Ac="}
InstallationDate	1591494222935
FirstServerRunTimestamp	1591494222945
DiagnosticId	y8hkta6qppbebdweyuqjuoq6ra
AdvancedPermissionsMigrationComplete	true
EmojisPermissionsMigrationComplete	true
GuestRolesCreationMigrationComplete	true
emoji_permissions_split	true
webhook_permissions_split	true
list_join_public_private_teams	true
remove_permanent_delete_user	true
add_bot_permissions	true
apply_channel_manage_delete_to_channel_user	true
remove_channel_manage_delete_from_team_user	true
view_members_new_permission	true
add_manage_guests_permissions	true
channel_moderations_permissions	true
add_use_group_mentions_permission	true
LastSecurityTime	1591494223786
migration_advanced_permissions_phase_2	true
\.


--
-- Data for Name: teammembers; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.teammembers (teamid, userid, roles, deleteat, schemeuser, schemeadmin, schemeguest) FROM stdin;
msexnx44xpfaxey74t7dikpm3h	gr8a7ec9gtnkikk9n5u8rjecca		0	t	t	f
\.


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.teams (id, createat, updateat, deleteat, displayname, name, description, email, type, companyname, alloweddomains, inviteid, allowopeninvite, lastteamiconupdate, schemeid, groupconstrained) FROM stdin;
msexnx44xpfaxey74t7dikpm3h	1591494282537	1591494282537	0	eligendi	ad-1		sysadmin@sample.mattermost.com	O			k7ycih8a3tbddx5b4px4ueoizr	f	0	\N	\N
\.


--
-- Data for Name: termsofservice; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.termsofservice (id, createat, userid, text) FROM stdin;
\.


--
-- Data for Name: tokens; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.tokens (token, createat, type, extra) FROM stdin;
\.


--
-- Data for Name: useraccesstokens; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.useraccesstokens (id, token, userid, description, isactive) FROM stdin;
\.


--
-- Data for Name: usergroups; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.usergroups (id, name, displayname, description, source, remoteid, createat, updateat, deleteat, allowreference) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.users (id, createat, updateat, deleteat, username, password, authdata, authservice, email, emailverified, nickname, firstname, lastname, "position", roles, allowmarketing, props, notifyprops, lastpasswordupdate, lastpictureupdate, failedattempts, locale, timezone, mfaactive, mfasecret) FROM stdin;
gr8a7ec9gtnkikk9n5u8rjecca	1591494272002	1591494292772	0	sysadmin	$2a$10$xDhE/EIB6cAYTNahPSs/dumEr.lOce6mIHz4h1i6O5MesQvEw0Ts.	\N		sysadmin@sample.mattermost.com	f		Kenneth	Moreno		system_admin system_user	t	{}	{"channel":"true","comments":"never","desktop":"mention","desktop_sound":"true","email":"true","first_name":"false","mention_keys":"","push":"mention","push_status":"away"}	1591494272002	0	0	en	{"automaticTimezone":"","manualTimezone":"","useAutomaticTimezone":"true"}	f	
\.


--
-- Data for Name: usertermsofservice; Type: TABLE DATA; Schema: public; Owner: mmuser
--

COPY public.usertermsofservice (userid, termsofserviceid, createat) FROM stdin;
\.


--
-- Name: audits_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.audits
    ADD CONSTRAINT audits_pkey PRIMARY KEY (id);


--
-- Name: bots_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.bots
    ADD CONSTRAINT bots_pkey PRIMARY KEY (userid);


--
-- Name: channelmemberhistory_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.channelmemberhistory
    ADD CONSTRAINT channelmemberhistory_pkey PRIMARY KEY (channelid, userid, jointime);


--
-- Name: channelmembers_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.channelmembers
    ADD CONSTRAINT channelmembers_pkey PRIMARY KEY (channelid, userid);


--
-- Name: channels_name_teamid_key; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.channels
    ADD CONSTRAINT channels_name_teamid_key UNIQUE (name, teamid);


--
-- Name: channels_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.channels
    ADD CONSTRAINT channels_pkey PRIMARY KEY (id);


--
-- Name: clusterdiscovery_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.clusterdiscovery
    ADD CONSTRAINT clusterdiscovery_pkey PRIMARY KEY (id);


--
-- Name: commands_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.commands
    ADD CONSTRAINT commands_pkey PRIMARY KEY (id);


--
-- Name: commandwebhooks_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.commandwebhooks
    ADD CONSTRAINT commandwebhooks_pkey PRIMARY KEY (id);


--
-- Name: compliances_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.compliances
    ADD CONSTRAINT compliances_pkey PRIMARY KEY (id);


--
-- Name: emoji_name_deleteat_key; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.emoji
    ADD CONSTRAINT emoji_name_deleteat_key UNIQUE (name, deleteat);


--
-- Name: emoji_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.emoji
    ADD CONSTRAINT emoji_pkey PRIMARY KEY (id);


--
-- Name: fileinfo_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.fileinfo
    ADD CONSTRAINT fileinfo_pkey PRIMARY KEY (id);


--
-- Name: groupchannels_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.groupchannels
    ADD CONSTRAINT groupchannels_pkey PRIMARY KEY (groupid, channelid);


--
-- Name: groupmembers_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.groupmembers
    ADD CONSTRAINT groupmembers_pkey PRIMARY KEY (groupid, userid);


--
-- Name: groupteams_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.groupteams
    ADD CONSTRAINT groupteams_pkey PRIMARY KEY (groupid, teamid);


--
-- Name: incomingwebhooks_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.incomingwebhooks
    ADD CONSTRAINT incomingwebhooks_pkey PRIMARY KEY (id);


--
-- Name: jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: licenses_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.licenses
    ADD CONSTRAINT licenses_pkey PRIMARY KEY (id);


--
-- Name: linkmetadata_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.linkmetadata
    ADD CONSTRAINT linkmetadata_pkey PRIMARY KEY (hash);


--
-- Name: oauthaccessdata_clientid_userid_key; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.oauthaccessdata
    ADD CONSTRAINT oauthaccessdata_clientid_userid_key UNIQUE (clientid, userid);


--
-- Name: oauthaccessdata_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.oauthaccessdata
    ADD CONSTRAINT oauthaccessdata_pkey PRIMARY KEY (token);


--
-- Name: oauthapps_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.oauthapps
    ADD CONSTRAINT oauthapps_pkey PRIMARY KEY (id);


--
-- Name: oauthauthdata_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.oauthauthdata
    ADD CONSTRAINT oauthauthdata_pkey PRIMARY KEY (code);


--
-- Name: outgoingwebhooks_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.outgoingwebhooks
    ADD CONSTRAINT outgoingwebhooks_pkey PRIMARY KEY (id);


--
-- Name: pluginkeyvaluestore_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.pluginkeyvaluestore
    ADD CONSTRAINT pluginkeyvaluestore_pkey PRIMARY KEY (pluginid, pkey);


--
-- Name: posts_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.preferences
    ADD CONSTRAINT preferences_pkey PRIMARY KEY (userid, category, name);


--
-- Name: publicchannels_name_teamid_key; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.publicchannels
    ADD CONSTRAINT publicchannels_name_teamid_key UNIQUE (name, teamid);


--
-- Name: publicchannels_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.publicchannels
    ADD CONSTRAINT publicchannels_pkey PRIMARY KEY (id);


--
-- Name: reactions_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.reactions
    ADD CONSTRAINT reactions_pkey PRIMARY KEY (postid, userid, emojiname);


--
-- Name: roles_name_key; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: schemes_name_key; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.schemes
    ADD CONSTRAINT schemes_name_key UNIQUE (name);


--
-- Name: schemes_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.schemes
    ADD CONSTRAINT schemes_pkey PRIMARY KEY (id);


--
-- Name: sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: status_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.status
    ADD CONSTRAINT status_pkey PRIMARY KEY (userid);


--
-- Name: systems_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.systems
    ADD CONSTRAINT systems_pkey PRIMARY KEY (name);


--
-- Name: teammembers_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.teammembers
    ADD CONSTRAINT teammembers_pkey PRIMARY KEY (teamid, userid);


--
-- Name: teams_name_key; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_name_key UNIQUE (name);


--
-- Name: teams_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: termsofservice_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.termsofservice
    ADD CONSTRAINT termsofservice_pkey PRIMARY KEY (id);


--
-- Name: tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_pkey PRIMARY KEY (token);


--
-- Name: useraccesstokens_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.useraccesstokens
    ADD CONSTRAINT useraccesstokens_pkey PRIMARY KEY (id);


--
-- Name: useraccesstokens_token_key; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.useraccesstokens
    ADD CONSTRAINT useraccesstokens_token_key UNIQUE (token);


--
-- Name: usergroups_name_key; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.usergroups
    ADD CONSTRAINT usergroups_name_key UNIQUE (name);


--
-- Name: usergroups_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.usergroups
    ADD CONSTRAINT usergroups_pkey PRIMARY KEY (id);


--
-- Name: usergroups_source_remoteid_key; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.usergroups
    ADD CONSTRAINT usergroups_source_remoteid_key UNIQUE (source, remoteid);


--
-- Name: users_authdata_key; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_authdata_key UNIQUE (authdata);


--
-- Name: users_email_key; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_username_key; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: usertermsofservice_pkey; Type: CONSTRAINT; Schema: public; Owner: mmuser; Tablespace: 
--

ALTER TABLE ONLY public.usertermsofservice
    ADD CONSTRAINT usertermsofservice_pkey PRIMARY KEY (userid);


--
-- Name: idx_audits_user_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_audits_user_id ON public.audits USING btree (userid);


--
-- Name: idx_channel_search_txt; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_channel_search_txt ON public.channels USING gin (to_tsvector('english'::regconfig, (((((name)::text || ' '::text) || (displayname)::text) || ' '::text) || (purpose)::text)));


--
-- Name: idx_channelmembers_channel_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_channelmembers_channel_id ON public.channelmembers USING btree (channelid);


--
-- Name: idx_channelmembers_user_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_channelmembers_user_id ON public.channelmembers USING btree (userid);


--
-- Name: idx_channels_create_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_channels_create_at ON public.channels USING btree (createat);


--
-- Name: idx_channels_delete_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_channels_delete_at ON public.channels USING btree (deleteat);


--
-- Name: idx_channels_displayname_lower; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_channels_displayname_lower ON public.channels USING btree (lower((displayname)::text));


--
-- Name: idx_channels_name; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_channels_name ON public.channels USING btree (name);


--
-- Name: idx_channels_name_lower; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_channels_name_lower ON public.channels USING btree (lower((name)::text));


--
-- Name: idx_channels_scheme_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_channels_scheme_id ON public.channels USING btree (schemeid);


--
-- Name: idx_channels_team_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_channels_team_id ON public.channels USING btree (teamid);


--
-- Name: idx_channels_update_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_channels_update_at ON public.channels USING btree (updateat);


--
-- Name: idx_command_create_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_command_create_at ON public.commands USING btree (createat);


--
-- Name: idx_command_delete_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_command_delete_at ON public.commands USING btree (deleteat);


--
-- Name: idx_command_team_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_command_team_id ON public.commands USING btree (teamid);


--
-- Name: idx_command_update_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_command_update_at ON public.commands USING btree (updateat);


--
-- Name: idx_command_webhook_create_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_command_webhook_create_at ON public.commandwebhooks USING btree (createat);


--
-- Name: idx_emoji_create_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_emoji_create_at ON public.emoji USING btree (createat);


--
-- Name: idx_emoji_delete_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_emoji_delete_at ON public.emoji USING btree (deleteat);


--
-- Name: idx_emoji_name; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_emoji_name ON public.emoji USING btree (name);


--
-- Name: idx_emoji_update_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_emoji_update_at ON public.emoji USING btree (updateat);


--
-- Name: idx_fileinfo_create_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_fileinfo_create_at ON public.fileinfo USING btree (createat);


--
-- Name: idx_fileinfo_delete_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_fileinfo_delete_at ON public.fileinfo USING btree (deleteat);


--
-- Name: idx_fileinfo_postid_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_fileinfo_postid_at ON public.fileinfo USING btree (postid);


--
-- Name: idx_fileinfo_update_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_fileinfo_update_at ON public.fileinfo USING btree (updateat);


--
-- Name: idx_groupchannels_channelid; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_groupchannels_channelid ON public.groupchannels USING btree (channelid);


--
-- Name: idx_groupchannels_schemeadmin; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_groupchannels_schemeadmin ON public.groupchannels USING btree (schemeadmin);


--
-- Name: idx_groupmembers_create_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_groupmembers_create_at ON public.groupmembers USING btree (createat);


--
-- Name: idx_groupteams_schemeadmin; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_groupteams_schemeadmin ON public.groupteams USING btree (schemeadmin);


--
-- Name: idx_groupteams_teamid; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_groupteams_teamid ON public.groupteams USING btree (teamid);


--
-- Name: idx_incoming_webhook_create_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_incoming_webhook_create_at ON public.incomingwebhooks USING btree (createat);


--
-- Name: idx_incoming_webhook_delete_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_incoming_webhook_delete_at ON public.incomingwebhooks USING btree (deleteat);


--
-- Name: idx_incoming_webhook_team_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_incoming_webhook_team_id ON public.incomingwebhooks USING btree (teamid);


--
-- Name: idx_incoming_webhook_update_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_incoming_webhook_update_at ON public.incomingwebhooks USING btree (updateat);


--
-- Name: idx_incoming_webhook_user_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_incoming_webhook_user_id ON public.incomingwebhooks USING btree (userid);


--
-- Name: idx_jobs_type; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_jobs_type ON public.jobs USING btree (type);


--
-- Name: idx_link_metadata_url_timestamp; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_link_metadata_url_timestamp ON public.linkmetadata USING btree (url, "timestamp");


--
-- Name: idx_oauthaccessdata_client_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_oauthaccessdata_client_id ON public.oauthaccessdata USING btree (clientid);


--
-- Name: idx_oauthaccessdata_refresh_token; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_oauthaccessdata_refresh_token ON public.oauthaccessdata USING btree (refreshtoken);


--
-- Name: idx_oauthaccessdata_user_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_oauthaccessdata_user_id ON public.oauthaccessdata USING btree (userid);


--
-- Name: idx_oauthapps_creator_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_oauthapps_creator_id ON public.oauthapps USING btree (creatorid);


--
-- Name: idx_oauthauthdata_client_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_oauthauthdata_client_id ON public.oauthauthdata USING btree (code);


--
-- Name: idx_outgoing_webhook_create_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_outgoing_webhook_create_at ON public.outgoingwebhooks USING btree (createat);


--
-- Name: idx_outgoing_webhook_delete_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_outgoing_webhook_delete_at ON public.outgoingwebhooks USING btree (deleteat);


--
-- Name: idx_outgoing_webhook_team_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_outgoing_webhook_team_id ON public.outgoingwebhooks USING btree (teamid);


--
-- Name: idx_outgoing_webhook_update_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_outgoing_webhook_update_at ON public.outgoingwebhooks USING btree (updateat);


--
-- Name: idx_posts_channel_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_posts_channel_id ON public.posts USING btree (channelid);


--
-- Name: idx_posts_channel_id_delete_at_create_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_posts_channel_id_delete_at_create_at ON public.posts USING btree (channelid, deleteat, createat);


--
-- Name: idx_posts_channel_id_update_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_posts_channel_id_update_at ON public.posts USING btree (channelid, updateat);


--
-- Name: idx_posts_create_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_posts_create_at ON public.posts USING btree (createat);


--
-- Name: idx_posts_delete_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_posts_delete_at ON public.posts USING btree (deleteat);


--
-- Name: idx_posts_hashtags_txt; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_posts_hashtags_txt ON public.posts USING gin (to_tsvector('english'::regconfig, (hashtags)::text));


--
-- Name: idx_posts_is_pinned; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_posts_is_pinned ON public.posts USING btree (ispinned);


--
-- Name: idx_posts_message_txt; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_posts_message_txt ON public.posts USING gin (to_tsvector('english'::regconfig, (message)::text));


--
-- Name: idx_posts_root_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_posts_root_id ON public.posts USING btree (rootid);


--
-- Name: idx_posts_update_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_posts_update_at ON public.posts USING btree (updateat);


--
-- Name: idx_posts_user_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_posts_user_id ON public.posts USING btree (userid);


--
-- Name: idx_preferences_category; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_preferences_category ON public.preferences USING btree (category);


--
-- Name: idx_preferences_name; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_preferences_name ON public.preferences USING btree (name);


--
-- Name: idx_preferences_user_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_preferences_user_id ON public.preferences USING btree (userid);


--
-- Name: idx_publicchannels_delete_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_publicchannels_delete_at ON public.publicchannels USING btree (deleteat);


--
-- Name: idx_publicchannels_displayname_lower; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_publicchannels_displayname_lower ON public.publicchannels USING btree (lower((displayname)::text));


--
-- Name: idx_publicchannels_name; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_publicchannels_name ON public.publicchannels USING btree (name);


--
-- Name: idx_publicchannels_name_lower; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_publicchannels_name_lower ON public.publicchannels USING btree (lower((name)::text));


--
-- Name: idx_publicchannels_search_txt; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_publicchannels_search_txt ON public.publicchannels USING gin (to_tsvector('english'::regconfig, (((((name)::text || ' '::text) || (displayname)::text) || ' '::text) || (purpose)::text)));


--
-- Name: idx_publicchannels_team_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_publicchannels_team_id ON public.publicchannels USING btree (teamid);


--
-- Name: idx_schemes_channel_admin_role; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_schemes_channel_admin_role ON public.schemes USING btree (defaultchanneladminrole);


--
-- Name: idx_schemes_channel_guest_role; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_schemes_channel_guest_role ON public.schemes USING btree (defaultchannelguestrole);


--
-- Name: idx_schemes_channel_user_role; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_schemes_channel_user_role ON public.schemes USING btree (defaultchanneluserrole);


--
-- Name: idx_sessions_create_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_sessions_create_at ON public.sessions USING btree (createat);


--
-- Name: idx_sessions_expires_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_sessions_expires_at ON public.sessions USING btree (expiresat);


--
-- Name: idx_sessions_last_activity_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_sessions_last_activity_at ON public.sessions USING btree (lastactivityat);


--
-- Name: idx_sessions_token; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_sessions_token ON public.sessions USING btree (token);


--
-- Name: idx_sessions_user_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_sessions_user_id ON public.sessions USING btree (userid);


--
-- Name: idx_status_status; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_status_status ON public.status USING btree (status);


--
-- Name: idx_status_user_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_status_user_id ON public.status USING btree (userid);


--
-- Name: idx_teammembers_delete_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_teammembers_delete_at ON public.teammembers USING btree (deleteat);


--
-- Name: idx_teammembers_team_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_teammembers_team_id ON public.teammembers USING btree (teamid);


--
-- Name: idx_teammembers_user_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_teammembers_user_id ON public.teammembers USING btree (userid);


--
-- Name: idx_teams_create_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_teams_create_at ON public.teams USING btree (createat);


--
-- Name: idx_teams_delete_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_teams_delete_at ON public.teams USING btree (deleteat);


--
-- Name: idx_teams_invite_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_teams_invite_id ON public.teams USING btree (inviteid);


--
-- Name: idx_teams_name; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_teams_name ON public.teams USING btree (name);


--
-- Name: idx_teams_scheme_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_teams_scheme_id ON public.teams USING btree (schemeid);


--
-- Name: idx_teams_update_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_teams_update_at ON public.teams USING btree (updateat);


--
-- Name: idx_user_access_tokens_token; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_user_access_tokens_token ON public.useraccesstokens USING btree (token);


--
-- Name: idx_user_access_tokens_user_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_user_access_tokens_user_id ON public.useraccesstokens USING btree (userid);


--
-- Name: idx_user_terms_of_service_user_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_user_terms_of_service_user_id ON public.usertermsofservice USING btree (userid);


--
-- Name: idx_usergroups_delete_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_usergroups_delete_at ON public.usergroups USING btree (deleteat);


--
-- Name: idx_usergroups_remote_id; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_usergroups_remote_id ON public.usergroups USING btree (remoteid);


--
-- Name: idx_users_all_no_full_name_txt; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_users_all_no_full_name_txt ON public.users USING gin (to_tsvector('english'::regconfig, (((((username)::text || ' '::text) || (nickname)::text) || ' '::text) || (email)::text)));


--
-- Name: idx_users_all_txt; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_users_all_txt ON public.users USING gin (to_tsvector('english'::regconfig, (((((((((username)::text || ' '::text) || (firstname)::text) || ' '::text) || (lastname)::text) || ' '::text) || (nickname)::text) || ' '::text) || (email)::text)));


--
-- Name: idx_users_create_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_users_create_at ON public.users USING btree (createat);


--
-- Name: idx_users_delete_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_users_delete_at ON public.users USING btree (deleteat);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_email_lower_textpattern; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_users_email_lower_textpattern ON public.users USING btree (lower((email)::text) text_pattern_ops);


--
-- Name: idx_users_firstname_lower_textpattern; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_users_firstname_lower_textpattern ON public.users USING btree (lower((firstname)::text) text_pattern_ops);


--
-- Name: idx_users_lastname_lower_textpattern; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_users_lastname_lower_textpattern ON public.users USING btree (lower((lastname)::text) text_pattern_ops);


--
-- Name: idx_users_names_no_full_name_txt; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_users_names_no_full_name_txt ON public.users USING gin (to_tsvector('english'::regconfig, (((username)::text || ' '::text) || (nickname)::text)));


--
-- Name: idx_users_names_txt; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_users_names_txt ON public.users USING gin (to_tsvector('english'::regconfig, (((((((username)::text || ' '::text) || (firstname)::text) || ' '::text) || (lastname)::text) || ' '::text) || (nickname)::text)));


--
-- Name: idx_users_nickname_lower_textpattern; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_users_nickname_lower_textpattern ON public.users USING btree (lower((nickname)::text) text_pattern_ops);


--
-- Name: idx_users_update_at; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_users_update_at ON public.users USING btree (updateat);


--
-- Name: idx_users_username_lower_textpattern; Type: INDEX; Schema: public; Owner: mmuser; Tablespace: 
--

CREATE INDEX idx_users_username_lower_textpattern ON public.users USING btree (lower((username)::text) text_pattern_ops);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: mmuser
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM mmuser;
GRANT ALL ON SCHEMA public TO mmuser;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

