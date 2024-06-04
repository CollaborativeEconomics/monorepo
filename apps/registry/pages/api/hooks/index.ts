import { NextApiRequest, NextApiResponse } from "next"
import { getHookByTriggerAndOrg } from "lib/database/hook"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { triggerName, orgId } = req.query;

    if (!triggerName || !orgId) {
      return res.status(400).json({ message: "Missing required parameters: triggerName and orgId" });
    }
  
    try {
      const hook = await getHookByTriggerAndOrg(String(triggerName), String(orgId));
      if (hook) {
        res.json(hook);
      } else {
        res.status(404).json({ message: "Hook not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
}


