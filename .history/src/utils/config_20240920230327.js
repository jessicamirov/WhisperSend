/**
 * Configuration object for peer-to-peer connections.
 * 
 * The `peerConfig` object defines the configuration settings for establishing peer-to-peer connections using WebRTC.
 * It includes a list of ICE (Interactive Connectivity Establishment) servers to assist in establishing and maintaining 
 * the connection, particularly in cases where the peers are behind NATs or firewalls.
 * The current configuration uses a public STUN server provided by Google to handle NAT traversal.
 * The STUN server's role is to help peers discover their public IP addresses for facilitating the connection.
 */
export const peerConfig = {
    config: {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    },
}
