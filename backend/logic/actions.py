def execute_action(action_name: str, parameters: dict = None) -> dict:
    """
    Sub-routing mechanism for agent actions.
    Useful for executing backend side-effects based on agent decisions.
    """
    params = parameters or {}
    print(f"[ACTION MANAGER] Routing execution for: {action_name} with parameters: {params}")
    return {
        "action": action_name,
        "success": True,
        "payload": {
            "msg": f"Action '{action_name}' registered and executed on agent host.",
            "inputs": params
        }
    }
