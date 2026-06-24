"use client";

import { useEffect, useState } from "react";
import { Plus, BookOpen, Clock, Tag, Trash2, Edit2, Loader2, Phone, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CourseService } from "@/services/course";

interface PaymentMethod {
  name: string;
  number: string;
}

interface Course {
  _id: string;
  name: string;
  length: string;
  price: number;
  discountPrice: number | null;
  description: string;
  paymentMethods: PaymentMethod[];
}

export default function CoursesPanel() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    length: "",
    price: "",
    discountPrice: "",
    description: ""
  });

  // ডাইনামিক পেমেন্ট মেথডের স্টেট ম্যানেজমেন্ট
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { name: "Bkash", number: "" }
  ]);

  const fetchCourses = async () => {
    setLoading(true);
    const res = await CourseService.getAllCourses();
    if (res?.success) {
      setCourses(res.data);
    } else {
      toast.error(res?.message || "কোর্স লোড করতে ব্যর্থ হয়েছে");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const closeFormModal = () => {
    setIsOpen(false);
    setEditingId(null);
    setFormData({ name: "", length: "", price: "", discountPrice: "", description: "" });
    setPaymentMethods([{ name: "Bkash", number: "" }]);
  };

  const handleEditClick = (course: Course) => {
    setEditingId(course._id);
    setFormData({
      name: course.name,
      length: course.length.replace(" মাস", ""),
      price: course.price.toString(),
      discountPrice: course.discountPrice ? course.discountPrice.toString() : "",
      description: course.description
    });
    setPaymentMethods(course.paymentMethods?.length ? course.paymentMethods : [{ name: "Bkash", number: "" }]);
    setIsOpen(true);
  };

  // ডাইনামিক পেমেন্ট ফিল্ড হ্যান্ডেল করার লজিক
  const handlePaymentMethodChange = (index: number, field: keyof PaymentMethod, value: string) => {
    const updated = [...paymentMethods];
    updated[index][field] = value;
    setPaymentMethods(updated);
  };

  const addPaymentMethodField = () => {
    setPaymentMethods([...paymentMethods, { name: "Bkash", number: "" }]);
  };

  const removePaymentMethodField = (index: number) => {
    if (paymentMethods.length === 1) {
      toast.error("কমপক্ষে একটি পেমেন্ট মেথড থাকা আবশ্যক");
      return;
    }
    setPaymentMethods(paymentMethods.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.length || !formData.price) {
      toast.error("অনুগ্রহ করে প্রয়োজনীয় তথ্যগুলো পূরণ করুন");
      return;
    }

    // 🚀 ফোন নম্বর ভ্যালিডেশন চেক (০১ দিয়ে শুরু এবং মোট ১১ ডিজিট)
    const phoneRegex = /^01\d{9}$/;
    
    if (paymentMethods.length === 0) {
      toast.error("কমপক্ষে একটি পেমেন্ট মেথড ও নম্বর যোগ করুন");
      return;
    }

    for (let i = 0; i < paymentMethods.length; i++) {
      const pm = paymentMethods[i];
      if (!pm.number.trim()) {
        toast.error(`অনুগ্রহ করে ${pm.name}-এর নম্বরটি প্রবেশ করান`);
        return;
      }
      if (!phoneRegex.test(pm.number.trim())) {
        toast.error(`${pm.name}-এর নম্বরটি সঠিক নয়! (অবশ্যই 01 দিয়ে শুরু এবং 11 ডিজিট হতে হবে)`);
        return;
      }
    }

    const coursePayload = {
      name: formData.name,
      length: `${formData.length} মাস`,
      price: Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
      description: formData.description,
      paymentMethods: paymentMethods
    };

    if (editingId) {
      const res = await CourseService.updateCourse(editingId, coursePayload);
      if (res?.success) {
        toast.success("কোর্সটি সফলভাবে আপডেট করা হয়েছে!");
        fetchCourses();
        closeFormModal();
      } else {
        toast.error(res?.message || "আপডেট করা সম্ভব হয়নি");
      }
    } else {
      const res = await CourseService.createCourse(coursePayload);
      if (res?.success) {
        toast.success("নতুন কোর্স তৈরি হয়েছে!");
        fetchCourses();
        closeFormModal();
      } else {
        toast.error(res?.message || "কোর্স তৈরি করা সম্ভব হয়নি");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই কোর্সটি মুছে ফেলতে চান?")) return;
    const res = await CourseService.deleteCourse(id);
    if (res?.success) {
      toast.success("কোর্সটি সফলভাবে মুছে ফেলা হয়েছে!");
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } else {
      toast.error(res?.message || "মুছে ফেলা সম্ভব হয়নি");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">কোর্স তালিকা</h3>
        <Button onClick={() => setIsOpen(true)} className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground gap-1.5">
          <Plus className="h-4 w-4" /> নতুন কোর্স তৈরি করুন
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : courses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">এখনো কোনো কোর্স তৈরি করা হয়নি।</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div key={course._id} className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-foreground">{course.name}</h4>
                  <div className="inline-flex gap-1">
                    <button onClick={() => handleEditClick(course)} className="text-muted-foreground hover:text-primary hover:bg-primary/10 p-1.5 rounded-md transition-colors"><Edit2 className="h-3.5 w-3.5" /></button>
                    <button onClick={() => handleDelete(course._id)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
                
                <p className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">{course.description}</p>
                
                {/* 🚀 ডাইনামিক পেমেন্ট নম্বর ডিসপ্লে (কার্ডে দেখার ব্যবস্থা) */}
                {course.paymentMethods && course.paymentMethods.length > 0 && (
                  <div className="mt-3 rounded-lg bg-secondary/60 p-2.5 border border-border/60">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1"><Wallet className="h-3 w-3" /> পেমেন্ট অ্যাকাউন্টসমূহ:</p>
                    <div className="grid grid-cols-1 gap-1 text-xs">
                      {course.paymentMethods.map((pm, idx) => (
                        <div key={idx} className="flex items-center justify-between font-mono rounded bg-card/50 px-2 py-1 border border-border/30">
                          <span className="font-semibold text-foreground/80">{pm.name}</span>
                          <span className="text-primary font-medium">{pm.number}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 space-y-2 border-t pt-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> মেয়াদ: <strong>{course.length}</strong></div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><Tag className="h-3.5 w-3.5 text-success" /> মূল্য: {course.discountPrice ? (<><span className="line-through text-destructive mr-1">৳{course.price}</span><strong>৳{course.discountPrice}</strong></>) : (<strong>৳{course.price}</strong>)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-lg my-8">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4"><BookOpen className="h-5 w-5 text-primary" /> {editingId ? "কোর্সের তথ্য পরিবর্তন করুন" : "নতুন কোর্স যোগ করুন"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-xs font-semibold">কোর্সের নাম *</Label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="যেমন: Full Stack Web Dev" className="mt-1" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-semibold">কোর্স ব্যাপ্তি (মাস) *</Label>
                  <Input type="number" value={formData.length} onChange={e => setFormData({...formData, length: e.target.value})} placeholder="6" className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs font-semibold">কোর্স ফি (৳) *</Label>
                  <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="5000" className="mt-1" />
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold">ডিসকাউন্ট মূল্য (ঐচ্ছিক)</Label>
                <Input type="number" value={formData.discountPrice} onChange={e => setFormData({...formData, discountPrice: e.target.value})} placeholder="4000" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs font-semibold">বিবরণ</Label>
                <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="কোর্সের বিবরণ... (নিউ লাইন বা এন্টার সাপোর্ট করবে)" rows={4} className="mt-1" />
              </div>

              {/* 🚀 ডাইনামিক পেমেন্ট মেথড ইনপুট সেকশন */}
              <div className="space-y-2 border-t pt-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-foreground flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> পেমেন্ট নম্বর সেট করুন (01... থেকে ১১ ডিজিট) *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addPaymentMethodField} className="h-7 text-xs gap-1"><Plus className="h-3 w-3" /> অ্যাড করুন</Button>
                </div>
                
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {paymentMethods.map((pm, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <select 
                        value={pm.name} 
                        onChange={e => handlePaymentMethodChange(index, "name", e.target.value)}
                        className="h-9 rounded-md border border-input bg-background px-2 py-1 text-sm font-medium shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="Bkash">Bkash</option>
                        <option value="Nagad">Nagad</option>
                        <option value="Upay">Upay</option>
                        <option value="Rocket">Rocket</option>
                      </select>
                      <Input 
                        type="text" 
                        maxLength={11}
                        value={pm.number} 
                        onChange={e => handlePaymentMethodChange(index, "number", e.target.value)} 
                        placeholder="যেমন: 017XXXXXXXX" 
                        className="h-9 flex-1 font-mono"
                      />
                      <Button type="button" variant="ghost" size="sm" onClick={() => removePaymentMethodField(index)} className="h-9 w-9 text-destructive p-0 hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t pt-4 mt-4">
                <Button type="button" variant="outline" onClick={closeFormModal}>বাতিল</Button>
                <Button type="submit" className="bg-success text-success-foreground">{editingId ? "আপডেট করুন" : "কোর্স তৈরি করুন"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}