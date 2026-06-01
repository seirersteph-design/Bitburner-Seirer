/** @param {NS} ns */
export async function main(ns) {

  const target = "johnson-ortho";
  // Check if you own the programs before trying to run them
  if (ns.fileExists("BruteSSH.exe", "home")) {
    ns.brutessh(target);
  }

  if (ns.fileExists("FTPCrack.exe", "home")) {
    ns.ftpcrack(target);
  }

  if (ns.fileExists("relaySMTP.exe", "home")) {
    ns.relaysmtp(target);
  }

  // NUKE the server to gain admin access
  ns.nuke(target);
  
  ns.tprint(`Server ${target} has been nuked!`);
}
