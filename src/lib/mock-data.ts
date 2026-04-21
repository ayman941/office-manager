export type Role = "employee" | "manager" | "hr" | "canteen";

export interface Employee {
  id: string;
  name: string;
  nameAr: string;
  department: string;
  departmentAr: string;
  email: string;
  desk: string;
  status: "present" | "leave" | "absent";
  avatar: string;
}

export interface MenuItem {
  id: string;
  name: string;
  nameAr: string;
  category: "main" | "drinks" | "snacks" | "desserts";
  price: number;
  stock: number;
  emoji: string;
  description: string;
  descriptionAr: string;
}

export interface Order {
  id: string;
  employeeName: string;
  employeeNameAr: string;
  desk: string;
  floor: number;
  zone: string;
  items: { menuId: string; name: string; nameAr: string; qty: number; price: number }[];
  total: number;
  status: "pending" | "preparing" | "delivering" | "delivered";
  createdAt: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "annual" | "sick" | "casual";
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

export const initialEmployees: Employee[] = [
  { id: "E001", name: "Ahmed Hassan", nameAr: "أحمد حسن", department: "Engineering", departmentAr: "هندسة", email: "ahmed@smartoffice.io", desk: "F2-A12", status: "present", avatar: "AH" },
  { id: "E002", name: "Sara Mohamed", nameAr: "سارة محمد", department: "Marketing", departmentAr: "تسويق", email: "sara@smartoffice.io", desk: "F1-B05", status: "present", avatar: "SM" },
  { id: "E003", name: "Omar Ali", nameAr: "عمر علي", department: "Engineering", departmentAr: "هندسة", email: "omar@smartoffice.io", desk: "F2-A14", status: "leave", avatar: "OA" },
  { id: "E004", name: "Mona Khaled", nameAr: "منى خالد", department: "Finance", departmentAr: "مالية", email: "mona@smartoffice.io", desk: "F3-C02", status: "present", avatar: "MK" },
  { id: "E005", name: "Karim Youssef", nameAr: "كريم يوسف", department: "Sales", departmentAr: "مبيعات", email: "karim@smartoffice.io", desk: "F1-B08", status: "absent", avatar: "KY" },
  { id: "E006", name: "Layla Ibrahim", nameAr: "ليلى إبراهيم", department: "HR", departmentAr: "موارد بشرية", email: "layla@smartoffice.io", desk: "F3-C10", status: "present", avatar: "LI" },
  { id: "E007", name: "Hassan Naguib", nameAr: "حسن نجيب", department: "Engineering", departmentAr: "هندسة", email: "hassan@smartoffice.io", desk: "F2-A20", status: "present", avatar: "HN" },
  { id: "E008", name: "Nour Adel", nameAr: "نور عادل", department: "Design", departmentAr: "تصميم", email: "nour@smartoffice.io", desk: "F1-B12", status: "present", avatar: "NA" },
  { id: "E009", name: "Tarek Samy", nameAr: "طارق سامي", department: "Sales", departmentAr: "مبيعات", email: "tarek@smartoffice.io", desk: "F1-B15", status: "leave", avatar: "TS" },
  { id: "E010", name: "Dina Farouk", nameAr: "دينا فاروق", department: "Marketing", departmentAr: "تسويق", email: "dina@smartoffice.io", desk: "F1-B07", status: "present", avatar: "DF" },
];

export const initialMenu: MenuItem[] = [
  { id: "M001", name: "Grilled Chicken", nameAr: "دجاج مشوي", category: "main", price: 85, stock: 12, emoji: "🍗", description: "With rice & salad", descriptionAr: "مع أرز وسلطة" },
  { id: "M002", name: "Beef Burger", nameAr: "برجر لحم", category: "main", price: 95, stock: 8, emoji: "🍔", description: "Classic with fries", descriptionAr: "كلاسيك مع بطاطس" },
  { id: "M003", name: "Chicken Shawarma", nameAr: "شاورما دجاج", category: "main", price: 65, stock: 0, emoji: "🌯", description: "Wrap with garlic sauce", descriptionAr: "ساندوتش بصوص الثوم" },
  { id: "M004", name: "Caesar Salad", nameAr: "سلطة سيزر", category: "main", price: 55, stock: 15, emoji: "🥗", description: "Fresh greens & croutons", descriptionAr: "خضروات طازجة" },
  { id: "M005", name: "Margherita Pizza", nameAr: "بيتزا مارجريتا", category: "main", price: 110, stock: 6, emoji: "🍕", description: "Tomato, mozzarella, basil", descriptionAr: "طماطم وموتزاريلا" },
  { id: "M006", name: "Fresh Orange Juice", nameAr: "عصير برتقال", category: "drinks", price: 25, stock: 20, emoji: "🍊", description: "Freshly squeezed", descriptionAr: "طازج" },
  { id: "M007", name: "Iced Coffee", nameAr: "قهوة مثلجة", category: "drinks", price: 35, stock: 25, emoji: "🧊", description: "Cold brew with milk", descriptionAr: "كولد برو بالحليب" },
  { id: "M008", name: "Mineral Water", nameAr: "مياه معدنية", category: "drinks", price: 10, stock: 50, emoji: "💧", description: "500ml bottle", descriptionAr: "زجاجة 500 مل" },
  { id: "M009", name: "Mixed Nuts", nameAr: "مكسرات", category: "snacks", price: 30, stock: 3, emoji: "🥜", description: "Roasted assortment", descriptionAr: "محمصة متنوعة" },
  { id: "M010", name: "Chocolate Cake", nameAr: "كيكة شوكولاتة", category: "desserts", price: 45, stock: 7, emoji: "🍰", description: "Rich & moist", descriptionAr: "غنية وطرية" },
  { id: "M011", name: "Fruit Bowl", nameAr: "طبق فواكه", category: "desserts", price: 40, stock: 9, emoji: "🍓", description: "Seasonal fruits", descriptionAr: "فواكه موسمية" },
  { id: "M012", name: "Granola Bar", nameAr: "بار جرانولا", category: "snacks", price: 20, stock: 18, emoji: "🍫", description: "Healthy snack", descriptionAr: "وجبة صحية" },
];

export const initialOrders: Order[] = [
  {
    id: "ORD-2401",
    employeeName: "Sara Mohamed",
    employeeNameAr: "سارة محمد",
    desk: "F1-B05",
    floor: 1,
    zone: "B",
    items: [
      { menuId: "M001", name: "Grilled Chicken", nameAr: "دجاج مشوي", qty: 1, price: 85 },
      { menuId: "M006", name: "Fresh Orange Juice", nameAr: "عصير برتقال", qty: 1, price: 25 },
    ],
    total: 110,
    status: "preparing",
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
  {
    id: "ORD-2402",
    employeeName: "Hassan Naguib",
    employeeNameAr: "حسن نجيب",
    desk: "F2-A20",
    floor: 2,
    zone: "A",
    items: [
      { menuId: "M002", name: "Beef Burger", nameAr: "برجر لحم", qty: 1, price: 95 },
    ],
    total: 95,
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
  },
  {
    id: "ORD-2403",
    employeeName: "Nour Adel",
    employeeNameAr: "نور عادل",
    desk: "F1-B12",
    floor: 1,
    zone: "B",
    items: [
      { menuId: "M005", name: "Margherita Pizza", nameAr: "بيتزا مارجريتا", qty: 1, price: 110 },
      { menuId: "M008", name: "Mineral Water", nameAr: "مياه معدنية", qty: 2, price: 10 },
    ],
    total: 130,
    status: "delivering",
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
];

export const initialLeaveRequests: LeaveRequest[] = [
  { id: "L001", employeeId: "E003", employeeName: "Omar Ali", type: "annual", startDate: "2025-04-21", endDate: "2025-04-25", reason: "Family vacation", status: "approved" },
  { id: "L002", employeeId: "E009", employeeName: "Tarek Samy", type: "sick", startDate: "2025-04-21", endDate: "2025-04-22", reason: "Flu", status: "approved" },
  { id: "L003", employeeId: "E001", employeeName: "Ahmed Hassan", type: "casual", startDate: "2025-04-28", endDate: "2025-04-28", reason: "Personal errand", status: "pending" },
];
