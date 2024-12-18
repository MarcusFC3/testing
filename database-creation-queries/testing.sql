/*
 * generate connection string
*/
select
    'data source=' + @@servername +
    ';initial catalog=' + db_name() +
    case type_desc
        when 'WINDOWS_LOGIN' 
            then ';trusted_connection=true'
        else
            ';user id=' + suser_name() + ';password=<<YourPassword>>'
    end
    as ConnectionString
from sys.server_principals
where name = suser_name()
/*
 * check db port
 */
select distinct local_net_address, local_tcp_port from sys.dm_exec_connections where local_net_address is not null

xp_readerrorlog 0, 1, N'Server is listening on'


SELECT  
   CONNECTIONPROPERTY('net_transport') AS net_transport,
   CONNECTIONPROPERTY('protocol_type') AS protocol_type,
   CONNECTIONPROPERTY('auth_scheme') AS auth_scheme,
   CONNECTIONPROPERTY('local_net_address') AS local_net_address,
   CONNECTIONPROPERTY('local_tcp_port') AS local_tcp_port,
   CONNECTIONPROPERTY('client_net_address') AS client_net_address 


   SELECT  @@SERVERNAME,
   CONNECTIONPROPERTY('net_transport') AS net_transport,
   CONNECTIONPROPERTY('protocol_type') AS protocol_type,
   CONNECTIONPROPERTY('auth_scheme') AS auth_scheme,
   CONNECTIONPROPERTY('local_net_address') AS local_net_address,
   CONNECTIONPROPERTY('local_tcp_port') AS MaskedTCPPort,
   CONVERT(BIGINT,CONNECTIONPROPERTY('local_tcp_port')) + 65536 AS ActualTCPPort, -- max port 65535 plus port 0 = 65536 to get the true port number
   ec.local_tcp_port AS ExecConnTCPPort,
   ec.local_tcp_port - CONVERT(BIGINT,CONNECTIONPROPERTY('local_tcp_port')) AS PortMask,
   CONNECTIONPROPERTY('client_net_address') AS client_net_address
   FROM sys.dm_exec_connections ec
   WHERE ec.local_net_address = CONNECTIONPROPERTY('local_net_address');
GO