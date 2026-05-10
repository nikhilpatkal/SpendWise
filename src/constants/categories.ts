export const expenseTypes = [
    { id: 1, name: "Shopping", icon: "cart", color: "#F59E0B" },
    { id: 2, name: "Food", icon: "fast-food", color: "#EF4444" },
    { id: 3, name: "Phone", icon: "call", color: "#3B82F6" },
    { id: 4, name: "Sports", icon: "football", color: "#10B981" },
    { id: 5, name: "Transport", icon: "car", color: "#8B5CF6" },
    { id: 6, name: "Health", icon: "medkit", color: "#EC4899" },
    { id: 7, name: "Education", icon: "school", color: "#6366F1" },
    { id: 8, name: "Bills", icon: "receipt", color: "#14B8A6" },
    { id: 9, name: "Rent", icon: "home", color: "#F97316" },
    { id: 10, name: "Travel", icon: "airplane", color: "#06B6D4" },
    { id: 11, name: "Gaming", icon: "game-controller", color: "#8B5CF6" },
    { id: 12, name: "Gifts", icon: "gift", color: "#F43F5E" },
];

export const incomeTypes = [
    { id: 1, name: "Salary", icon: "cash", color: "#10B981" },
    { id: 2, name: "Freelance", icon: "briefcase", color: "#8B5CF6" },
    { id: 3, name: "Investments", icon: "trending-up", color: "#3B82F6" },
    { id: 4, name: "Gifts", icon: "gift", color: "#F43F5E" },
    { id: 5, name: "Refunds", icon: "arrow-undo", color: "#14B8A6" },
    { id: 6, name: "Rental", icon: "home", color: "#F59E0B" },
];

export const transferTypes = [
    { id: 1, name: "Transfer", icon: "swap-horizontal", color: "#6366F1" },
    { id: 2, name: "Bank", icon: "business", color: "#3B82F6" },
    { id: 3, name: "Wallet", icon: "wallet", color: "#10B981" },
    { id: 4, name: "Credit Card", icon: "card", color: "#EF4444" },
];

export const getCategoryDetails = (type: string, id: number) => {
    let list;
    if (type === 'expense') list = expenseTypes;
    else if (type === 'income') list = incomeTypes;
    else list = transferTypes;

    return list.find(item => item.id === id) || { name: 'Unknown', icon: 'help-circle', color: '#9CA3AF' };
};
